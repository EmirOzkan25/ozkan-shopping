# 🛒 Özkan Shopping — Full-Stack E-Ticaret Uygulaması

Modern bir e-ticaret platformu. FastAPI (Python) backend ve React frontend ile geliştirilmiş, kullanıcı kimlik doğrulama, ürün yönetimi, sepet, sipariş, favoriler ve admin paneli içeren tam kapsamlı bir uygulama.

## 🚀 Özellikler

### Kullanıcı Tarafı
- **Kimlik doğrulama:** Kayıt ve giriş (JWT token tabanlı), şifreler bcrypt ile hash'lenir
- **Canlı şifre validasyonu:** Kayıt sırasında şifre kuralları anlık kontrol edilir
- **Ürün listeleme:** Kategori, fiyat, stok ve sıralamaya göre filtreleme
- **Arama:** Debounce'lu, anlık ürün arama
- **Ürün detayı:** Stok durumu göstergesi (Stokta var / Son X ürün / Tükendi)
- **Sepet:** Adet yönetimi, anlık fiyat hesaplama, kargo hesabı (500 TL üzeri ücretsiz)
- **Favoriler:** Kullanıcıya özel favori listesi, "geri al" (undo) özelliğiyle
- **Sipariş:** Giriş kontrollü sipariş akışı, stok kontrolü ve otomatik stok düşürme

### Admin Tarafı
- **Rol bazlı erişim:** Admin paneline yalnızca yetkili kullanıcılar erişebilir (frontend + backend çift katman koruma)
- **Ürün yönetimi:** Tam CRUD (ekleme, listeleme, düzenleme, silme)

## 🛠️ Kullanılan Teknolojiler

**Backend**
- FastAPI (Python web framework)
- PostgreSQL (veritabanı)
- SQLAlchemy (ORM)
- JWT (kimlik doğrulama)
- bcrypt (şifre hash'leme)

**Frontend**
- React (Vite)
- React Router (sayfa yönlendirme)
- Tailwind CSS (tasarım)
- Axios (API istekleri)
- Context API (global state yönetimi)
- react-hot-toast (bildirimler)

## 📦 Kurulum

### Gereksinimler
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### Backend Kurulumu

```bash
cd backend

# Sanal ortam oluştur ve aktifleştir
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Bağımlılıkları yükle
pip install -r requirements.txt

# .env dosyasını oluştur (.env.example'ı kopyalayıp doldurun)
# Sonra örnek verileri yükleyin:
python seed.py

# Sunucuyu başlat
uvicorn main:app --reload
```

Backend `http://127.0.0.1:8000` adresinde çalışır. API dokümantasyonu: `http://127.0.0.1:8000/docs`

### Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışır.

### Ortam Değişkenleri

`backend/.env` dosyası oluşturun (`.env.example` dosyasını referans alın):

DATABASE_URL=postgresql://postgres:SIFRENIZ@localhost:5432/eticaret_db
SECRET_KEY=gizli-anahtar
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

## 👤 Demo Hesaplar

Seed verisiyle birlikte gelen hazır hesaplar:

- **Admin:** `admin@eticaret.com` / `Admin1234`
- **Müşteri:** `musteri@mail.com` / `Musteri1234`

## 📝 Notlar

- Ürün filtreleme, veri seti küçük olduğu için client-side (frontend) yapılmıştır. Ölçeklenme gerekirse backend'e query parametreleriyle taşınabilir.
- Ürün görselleri URL tabanlıdır. Production ortamında dosya yükleme bir bulut depolama servisine (örn. AWS S3) bağlanabilir.

---

Bu proje öğrenme ve portföy amacıyla geliştirilmiştir.