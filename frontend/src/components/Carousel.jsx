import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Carousel({ products }) {
  const [aktifIndex, setAktifIndex] = useState(0);
  const navigate = useNavigate();

  // İlk 5 ürünü al (top 5)
  const slaytlar = products.slice(0, 5);

  // Otomatik kayma: her 4 saniyede bir sonraki slayta geç
  useEffect(() => {
    if (slaytlar.length === 0) return;

    const zamanlayici = setInterval(() => {
      setAktifIndex((onceki) => (onceki + 1) % slaytlar.length);
    }, 4000);

    // Temizlik: component kaldırılınca zamanlayıcıyı durdur
    return () => clearInterval(zamanlayici);
  }, [slaytlar.length]);

  if (slaytlar.length === 0) return null;

  return (
    <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md mb-8 bg-gradient-to-r from-blue-600 to-indigo-700">
      {slaytlar.map((urun, index) => (
        <div
          key={urun.id}
          className={`absolute inset-0 flex items-center justify-between px-8 sm:px-16 transition-opacity duration-700 ${
            index === aktifIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Sol: yazılar */}
          <div className="text-white max-w-md">
            <span className="inline-block bg-white/20 text-xs px-3 py-1 rounded-full mb-3">
              Öne Çıkan Ürün
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold mb-2">{urun.name}</h2>
            <p className="text-white/80 mb-4 hidden sm:block">
              {urun.description}
            </p>
            <div className="text-2xl sm:text-3xl font-bold mb-4">
              {urun.price.toLocaleString("tr-TR")} ₺
            </div>
            <button
              onClick={() => navigate(`/product/${urun.id}`)}
              className="bg-white text-blue-700 px-6 py-2.5 rounded-xl font-medium hover:bg-blue-50 transition"
            >
              İncele
            </button>
          </div>

          {/* Sağ: büyük emoji (görsel placeholder) */}
          {/* Sağ: ürün görseli */}
          <div className="hidden sm:block w-64 h-48 rounded-xl overflow-hidden shadow-lg">
            {urun.image_url ? (
              <img
                src={urun.image_url}
                alt={urun.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center text-8xl">
                📦
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Alt noktalar (hangi slayttayız) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slaytlar.map((_, index) => (
          <button
            key={index}
            onClick={() => setAktifIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              index === aktifIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;