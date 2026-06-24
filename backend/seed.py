from database import SessionLocal, engine
import models
from auth import sifrele

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()


def seed():
    # Eski veriyi temizle
    db.query(models.OrderItem).delete()
    db.query(models.Order).delete()
    db.query(models.Product).delete()
    db.query(models.Category).delete()
    db.query(models.User).delete()
    db.commit()

    # Admin ve müşteri
    admin = models.User(email="admin@eticaret.com", hashed_password=sifrele("Admin1234"), is_admin=True)
    db.add(admin)
    musteri = models.User(email="musteri@mail.com", hashed_password=sifrele("Musteri1234"), is_admin=False)
    db.add(musteri)

    # Kategoriler
    kategoriler = {
        "Elektronik": "Telefon, bilgisayar ve elektronik aksesuarlar",
        "Giyim": "Kadın, erkek ve çocuk giyim ürünleri",
        "Kitap": "Roman, ders kitabı ve dergiler",
        "Ev & Yaşam": "Mobilya, dekorasyon ve mutfak ürünleri",
        "Spor & Outdoor": "Spor ekipmanları ve outdoor malzemeleri",
    }
    kategori_nesneleri = {}
    for ad, aciklama in kategoriler.items():
        kat = models.Category(name=ad, description=aciklama)
        db.add(kat)
        kategori_nesneleri[ad] = kat
    db.flush()

    # Ürünler: (kategori, ad, açıklama, fiyat, stok)
    # Ürünler: (kategori, ad, açıklama, resim_url, fiyat, stok)
    urunler = [
        ("Elektronik", "Kablosuz Kulaklık", "Bluetooth 5.0, aktif gürültü engelleme", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", 1299.90, 50),
        ("Elektronik", "Akıllı Telefon", "6.5 inç ekran, 128GB depolama", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", 18999.00, 30),
        ("Elektronik", "Dizüstü Bilgisayar", "16GB RAM, 512GB SSD, i7 işlemci", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", 32499.00, 15),
        ("Elektronik", "Akıllı Saat", "Nabız ve uyku takibi, su geçirmez", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", 2499.50, 40),
        ("Elektronik", "Bluetooth Hoparlör", "Taşınabilir, 12 saat pil ömrü", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", 899.90, 60),
        ("Giyim", "Erkek Tişört", "%100 pamuk, slim fit", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", 199.90, 120),
        ("Giyim", "Kadın Elbise", "Yazlık çiçekli desen", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", 449.00, 80),
        ("Giyim", "Kot Pantolon", "Yüksek bel, dar paça", "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", 599.90, 70),
        ("Giyim", "Spor Ayakkabı", "Hafif taban, nefes alan kumaş", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", 1199.00, 55),
        ("Giyim", "Kışlık Mont", "Su geçirmez, içi peluş", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", 1899.90, 35),
        ("Kitap", "Suç ve Ceza", "Dostoyevski klasiği", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", 89.90, 200),
        ("Kitap", "Python ile Programlama", "Başlangıçtan ileri seviyeye", "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400", 249.00, 90),
        ("Kitap", "Sefiller", "Victor Hugo başyapıtı", "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400", 119.90, 150),
        ("Kitap", "Atomik Alışkanlıklar", "Kişisel gelişim rehberi", "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400", 159.90, 110),
        ("Ev & Yaşam", "Kahve Makinesi", "Otomatik, 1.5L kapasite", "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400", 1799.00, 45),
        ("Ev & Yaşam", "Yastık Seti", "2'li ortopedik yastık", "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", 349.90, 100),
        ("Ev & Yaşam", "Masa Lambası", "LED, ayarlanabilir parlaklık", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400", 279.90, 75),
        ("Ev & Yaşam", "Tencere Seti", "6 parça, çelik", "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400", 1499.00, 40),
        ("Spor & Outdoor", "Yoga Matı", "Kaymaz, 6mm kalınlık", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400", 299.90, 95),
        ("Spor & Outdoor", "Dambıl Seti", "Ayarlanabilir, 20kg", "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400", 1299.00, 30),
        ("Spor & Outdoor", "Kamp Çadırı", "4 kişilik, su geçirmez", "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400", 2199.90, 3),
        ("Spor & Outdoor", "Termos", "1L, 24 saat sıcak tutar", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400", 449.90, 85),
    ]
    for kat_adi, ad, aciklama, resim, fiyat, stok in urunler:
        urun = models.Product(name=ad, description=aciklama, image_url=resim,
                              price=fiyat, stock=stok,
                              category_id=kategori_nesneleri[kat_adi].id)
        db.add(urun)

    db.commit()
    print("✅ Seed tamamlandı!")
    print(f"   {len(kategoriler)} kategori eklendi")
    print(f"   {len(urunler)} ürün eklendi")
    print("   2 kullanıcı eklendi (admin@eticaret.com / Admin1234)")


if __name__ == "__main__":
    seed()
    db.close()