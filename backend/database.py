from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# .env dosyasındaki ayarları okur
load_dotenv()

# .env içindeki DATABASE_URL değerini alır
DATABASE_URL = os.getenv("DATABASE_URL")

# Veritabanı motorunu oluşturur (asıl bağlantı burada kuruluyor)
engine = create_engine(DATABASE_URL)

# Veritabanıyla her konuşmamız bir "session" üzerinden olur
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tablolarımız bu temel sınıftan türeyecek
Base = declarative_base()


# Her API isteğinde taze bir bağlantı verir, iş bitince kapatır
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()