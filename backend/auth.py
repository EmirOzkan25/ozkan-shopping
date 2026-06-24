import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

import models
from database import get_db

# .env dosyasındaki ayarları oku
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# Token'ın hangi yoldan geleceğini FastAPI'ye söyler (/login)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# --- ŞİFRELEME ---

def sifrele(duz_sifre: str) -> str:
    sifre_bytes = duz_sifre.encode("utf-8")
    salt = bcrypt.gensalt()
    hashlenmis = bcrypt.hashpw(sifre_bytes, salt)
    return hashlenmis.decode("utf-8")


def sifre_dogrula(duz_sifre: str, hashlenmis_sifre: str) -> bool:
    sifre_bytes = duz_sifre.encode("utf-8")
    hash_bytes = hashlenmis_sifre.encode("utf-8")
    return bcrypt.checkpw(sifre_bytes, hash_bytes)


# --- TOKEN ÜRETME ---

def token_olustur(veri: dict) -> str:
    kopya = veri.copy()
    bitis = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    kopya.update({"exp": bitis})
    token = jwt.encode(kopya, SECRET_KEY, algorithm=ALGORITHM)
    return token


# --- TOKEN DOĞRULAMA (kim bu kullanıcı?) ---

def aktif_kullanici(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Hata mesajını önceden hazırla
    hata = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Geçersiz veya süresi dolmuş token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # 1. Token'ı gizli anahtarla çöz
        veri = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # 2. İçinden e-postayı al (token üretirken "sub"a koymuştuk)
        email = veri.get("sub")
        if email is None:
            raise hata
    except JWTError:
        # Token bozuksa veya süresi dolmuşsa buraya düşer
        raise hata

    # 3. E-postayla kullanıcıyı veritabanında bul
    kullanici = db.query(models.User).filter(models.User.email == email).first()
    if kullanici is None:
        raise hata

    # 4. Kullanıcıyı geri döndür
    return kullanici

# --- ADMİN KONTROLÜ (admin mi değil mi?) ---

def admin_kullanici(mevcut_kullanici: models.User = Depends(aktif_kullanici)):
    # Önce aktif_kullanici çalışır (token geçerli mi?), sonra burası
    if not mevcut_kullanici.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem için admin yetkisi gerekli"
        )
    return mevcut_kullanici