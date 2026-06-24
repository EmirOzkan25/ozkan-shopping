from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
import re


# ===== KULLANICI ŞABLONLARI =====

class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def sifre_kurallari(cls, deger):
        if len(deger) < 8:
            raise ValueError("Şifre en az 8 karakter olmalı")
        if not re.search(r"[A-ZİĞÜŞÖÇ]", deger):
            raise ValueError("Şifre en az 1 büyük harf içermeli")
        if not re.search(r"[a-zıiğüşöç]", deger):
            raise ValueError("Şifre en az 1 küçük harf içermeli")
        if not re.search(r"[0-9]", deger):
            raise ValueError("Şifre en az 1 rakam içermeli")
        return deger


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ===== KATEGORİ ŞABLONLARI =====

class CategoryCreate(BaseModel):
    name: str
    description: str | None = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: str | None

    class Config:
        from_attributes = True


# ===== ÜRÜN ŞABLONLARI =====

class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    image_url: str | None = None
    price: float
    stock: int = 0
    category_id: int | None = None

    @field_validator("price")
    @classmethod
    def fiyat_kontrol(cls, deger):
        if deger <= 0:
            raise ValueError("Fiyat 0'dan büyük olmalı")
        return deger

    @field_validator("stock")
    @classmethod
    def stok_kontrol(cls, deger):
        if deger < 0:
            raise ValueError("Stok negatif olamaz")
        return deger


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str | None
    image_url: str | None
    price: float
    stock: int
    category_id: int | None
    created_at: datetime

    class Config:
        from_attributes = True


# ===== SİPARİŞ ŞABLONLARI =====

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

    @field_validator("quantity")
    @classmethod
    def adet_kontrol(cls, deger):
        if deger <= 0:
            raise ValueError("Adet 0'dan büyük olmalı")
        return deger


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    total_price: float
    created_at: datetime
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True

        # ===== FAVORİ ŞABLONLARI =====

class FavoriteResponse(BaseModel):
    id: int
    product_id: int

    class Config:
        from_attributes = True