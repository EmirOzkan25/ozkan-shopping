import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [basari, setBasari] = useState(false);
  const [hata, setHata] = useState("");
  // KARGO MANTIĞI
  const KARGO_UCRETI = 49.9;
  const BEDAVA_KARGO_LIMITI = 500;
  const kargoBedava = totalPrice >= BEDAVA_KARGO_LIMITI;
  const kargo = kargoBedava ? 0 : KARGO_UCRETI;
  const genelToplam = totalPrice + kargo;
  const bedavayaKalan = BEDAVA_KARGO_LIMITI - totalPrice;

  async function handleSiparis() {
    // Giriş yapılmamışsa → giriş sayfasına gönder, "sepetten geldim" bilgisiyle
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    setLoading(true);
    setHata("");

    try {
      // Backend'in beklediği format: { items: [{ product_id, quantity }] }
      const siparisVerisi = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      await api.post("/orders", siparisVerisi);

      // Başarılı: sepeti temizle, başarı ekranı göster
      clearCart();
      setBasari(true);
    } catch (err) {
      const mesaj =
        err.response?.data?.detail || "Sipariş oluşturulurken bir hata oluştu.";
      setHata(typeof mesaj === "string" ? mesaj : "Sipariş başarısız.");
      setLoading(false);
    }
  }

  // BAŞARI EKRANI
  if (basari) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Siparişiniz Alındı!
        </h1>
        <p className="text-slate-500 mb-6">
          Teşekkürler, siparişiniz başarıyla oluşturuldu.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    );
  }

  // BOŞ SEPET
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Sepetiniz boş
        </h1>
        <p className="text-slate-500 mb-6">Hadi alışverişe başlayın!</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
        >
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  // SEPET DOLU
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Sepetim</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Sepeti Boşalt
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SOL: Ürünler */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center text-3xl shrink-0">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "📦"
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{item.name}</h3>
                <p className="text-blue-600 font-bold">
                  {item.price.toLocaleString("tr-TR")} ₺
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  +
                </button>
              </div>
              <div className="w-28 text-right font-semibold text-slate-800">
                {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-slate-400 hover:text-red-500 text-xl shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* SAĞ: Özet */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-slate-800 mb-4">Sipariş Özeti</h2>

            {hata && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
                {hata}
              </div>
            )}

            <div className="flex justify-between text-slate-600 mb-2">
              <span>Ara Toplam</span>
              <span>{totalPrice.toLocaleString("tr-TR")} ₺</span>
            </div>
            <div className="flex justify-between text-slate-600 mb-2">
              <span>Kargo</span>
              {kargoBedava ? (
                <span className="text-green-600 font-medium">Ücretsiz</span>
              ) : (
                <span>{kargo.toLocaleString("tr-TR")} ₺</span>
              )}
            </div>

            {/* Bedava kargoya yaklaşma mesajı */}
            {!kargoBedava && (
              <div className="bg-blue-50 text-blue-700 text-xs p-2.5 rounded-lg mb-4">
                🚚 {bedavayaKalan.toLocaleString("tr-TR")} ₺ daha ekleyin, kargo
                bedava olsun!
              </div>
            )}

            <div className="border-t pt-4 flex justify-between font-bold text-lg text-slate-800">
              <span>Toplam</span>
              <span>{genelToplam.toLocaleString("tr-TR")} ₺</span>
            </div>

            <button
              onClick={handleSiparis}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:bg-slate-300"
            >
              {loading
                ? "Sipariş veriliyor..."
                : user
                ? "Siparişi Tamamla"
                : "Giriş Yap ve Sipariş Ver"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;