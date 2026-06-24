from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import engine, get_db
import models
import schemas
from fastapi.middleware.cors import CORSMiddleware
from auth import sifrele, sifre_dogrula, token_olustur, aktif_kullanici, admin_kullanici

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-ticaret API")

# CORS ayarı: frontend'in backend'e erişmesine izin ver
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def ana_sayfa():
    return {"mesaj": "E-ticaret API'si çalışıyor!"}


# ===== KULLANICI YOLLARI =====

@app.post("/register", response_model=schemas.UserResponse)
def kayit_ol(kullanici: schemas.UserCreate, db: Session = Depends(get_db)):
    mevcut = db.query(models.User).filter(models.User.email == kullanici.email).first()
    if mevcut:
        raise HTTPException(status_code=400, detail="Bu e-posta zaten kayıtlı")

    hashlenmis = sifrele(kullanici.password)
    yeni_kullanici = models.User(email=kullanici.email, hashed_password=hashlenmis)
    db.add(yeni_kullanici)
    db.commit()
    db.refresh(yeni_kullanici)
    return yeni_kullanici


@app.post("/login")
def giris_yap(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    kullanici = db.query(models.User).filter(models.User.email == form.username).first()
    if not kullanici or not sifre_dogrula(form.password, kullanici.hashed_password):
        raise HTTPException(status_code=401, detail="E-posta veya şifre hatalı")

    token = token_olustur({"sub": kullanici.email})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/profilim", response_model=schemas.UserResponse)
def profilim(mevcut_kullanici: models.User = Depends(aktif_kullanici)):
    return mevcut_kullanici


# ===== KATEGORİ YOLLARI =====

# KATEGORİ EKLE (sadece admin)
@app.post("/categories", response_model=schemas.CategoryResponse)
def kategori_ekle(kategori: schemas.CategoryCreate, db: Session = Depends(get_db),
                  admin: models.User = Depends(admin_kullanici)):
    mevcut = db.query(models.Category).filter(models.Category.name == kategori.name).first()
    if mevcut:
        raise HTTPException(status_code=400, detail="Bu kategori zaten var")

    yeni_kategori = models.Category(name=kategori.name, description=kategori.description)
    db.add(yeni_kategori)
    db.commit()
    db.refresh(yeni_kategori)
    return yeni_kategori


# TÜM KATEGORİLERİ LİSTELE (herkes)
@app.get("/categories", response_model=list[schemas.CategoryResponse])
def kategorileri_listele(db: Session = Depends(get_db)):
    return db.query(models.Category).all()


# BİR KATEGORİDEKİ ÜRÜNLERİ LİSTELE (herkes)
@app.get("/categories/{kategori_id}/products", response_model=list[schemas.ProductResponse])
def kategori_urunleri(kategori_id: int, db: Session = Depends(get_db)):
    kategori = db.query(models.Category).filter(models.Category.id == kategori_id).first()
    if not kategori:
        raise HTTPException(status_code=404, detail="Kategori bulunamadı")
    return db.query(models.Product).filter(models.Product.category_id == kategori_id).all()


# ===== ÜRÜN YOLLARI =====

@app.post("/products", response_model=schemas.ProductResponse)
def urun_ekle(urun: schemas.ProductCreate, db: Session = Depends(get_db),
              admin: models.User = Depends(admin_kullanici)):
    yeni_urun = models.Product(name=urun.name, description=urun.description,
                               image_url=urun.image_url,
                               price=urun.price, stock=urun.stock,
                               category_id=urun.category_id)
    db.add(yeni_urun)
    db.commit()
    db.refresh(yeni_urun)
    return yeni_urun


@app.get("/products", response_model=list[schemas.ProductResponse])
def urunleri_listele(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@app.get("/products/{urun_id}", response_model=schemas.ProductResponse)
def urun_detay(urun_id: int, db: Session = Depends(get_db)):
    urun = db.query(models.Product).filter(models.Product.id == urun_id).first()
    if not urun:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    return urun


@app.put("/products/{urun_id}", response_model=schemas.ProductResponse)
def urun_guncelle(urun_id: int, guncel: schemas.ProductCreate, db: Session = Depends(get_db),
                  admin: models.User = Depends(admin_kullanici)):
    urun = db.query(models.Product).filter(models.Product.id == urun_id).first()
    if not urun:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    urun.name = guncel.name
    urun.description = guncel.description
    urun.image_url = guncel.image_url
    urun.price = guncel.price
    urun.stock = guncel.stock
    urun.category_id = guncel.category_id
    db.commit()
    db.refresh(urun)
    return urun


@app.delete("/products/{urun_id}")
def urun_sil(urun_id: int, db: Session = Depends(get_db),
             admin: models.User = Depends(admin_kullanici)):
    urun = db.query(models.Product).filter(models.Product.id == urun_id).first()
    if not urun:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    db.delete(urun)
    db.commit()
    return {"mesaj": "Ürün silindi"}


# ===== SİPARİŞ YOLLARI =====

@app.post("/orders", response_model=schemas.OrderResponse)
def siparis_olustur(siparis: schemas.OrderCreate, db: Session = Depends(get_db),
                    mevcut_kullanici: models.User = Depends(aktif_kullanici)):
    if not siparis.items:
        raise HTTPException(status_code=400, detail="Sipariş en az 1 ürün içermeli")

    toplam_fiyat = 0
    kalemler = []

    for item in siparis.items:
        urun = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not urun:
            raise HTTPException(status_code=404,
                                detail=f"{item.product_id} numaralı ürün bulunamadı")
        if urun.stock < item.quantity:
            raise HTTPException(status_code=400,
                                detail=f"'{urun.name}' için yeterli stok yok (mevcut: {urun.stock})")
        toplam_fiyat += urun.price * item.quantity
        kalemler.append((urun, item.quantity))

    yeni_siparis = models.Order(user_id=mevcut_kullanici.id, total_price=toplam_fiyat)
    db.add(yeni_siparis)
    db.flush()

    for urun, adet in kalemler:
        kalem = models.OrderItem(order_id=yeni_siparis.id, product_id=urun.id,
                                 quantity=adet, price=urun.price)
        db.add(kalem)
        urun.stock -= adet

    db.commit()
    db.refresh(yeni_siparis)
    return yeni_siparis


@app.get("/orders", response_model=list[schemas.OrderResponse])
def siparislerim(db: Session = Depends(get_db),
                 mevcut_kullanici: models.User = Depends(aktif_kullanici)):
    return db.query(models.Order).filter(models.Order.user_id == mevcut_kullanici.id).all()

# ===== FAVORİ YOLLARI =====

# FAVORİLERİMİ LİSTELE
@app.get("/favorites", response_model=list[schemas.FavoriteResponse])
def favorilerim(db: Session = Depends(get_db),
                mevcut_kullanici: models.User = Depends(aktif_kullanici)):
    return db.query(models.Favorite).filter(
        models.Favorite.user_id == mevcut_kullanici.id
    ).all()


# FAVORİYE EKLE
@app.post("/favorites/{urun_id}", response_model=schemas.FavoriteResponse)
def favori_ekle(urun_id: int, db: Session = Depends(get_db),
                mevcut_kullanici: models.User = Depends(aktif_kullanici)):
    # Ürün var mı?
    urun = db.query(models.Product).filter(models.Product.id == urun_id).first()
    if not urun:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    # Zaten favoride mi?
    mevcut = db.query(models.Favorite).filter(
        models.Favorite.user_id == mevcut_kullanici.id,
        models.Favorite.product_id == urun_id
    ).first()
    if mevcut:
        raise HTTPException(status_code=400, detail="Ürün zaten favorilerde")

    yeni_favori = models.Favorite(user_id=mevcut_kullanici.id, product_id=urun_id)
    db.add(yeni_favori)
    db.commit()
    db.refresh(yeni_favori)
    return yeni_favori


# FAVORİDEN ÇIKAR
@app.delete("/favorites/{urun_id}")
def favori_cikar(urun_id: int, db: Session = Depends(get_db),
                 mevcut_kullanici: models.User = Depends(aktif_kullanici)):
    favori = db.query(models.Favorite).filter(
        models.Favorite.user_id == mevcut_kullanici.id,
        models.Favorite.product_id == urun_id
    ).first()
    if not favori:
        raise HTTPException(status_code=404, detail="Favori bulunamadı")

    db.delete(favori)
    db.commit()
    return {"mesaj": "Favorilerden çıkarıldı"}