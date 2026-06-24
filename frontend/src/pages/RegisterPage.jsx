import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Şifre kurallarını canlı kontrol et
  const kurallar = [
    { etiket: "En az 8 karakter", gecerli: password.length >= 8 },
    { etiket: "En az 1 büyük harf", gecerli: /[A-ZİĞÜŞÖÇ]/.test(password) },
    { etiket: "En az 1 küçük harf", gecerli: /[a-zıiğüşöç]/.test(password) },
    { etiket: "En az 1 rakam", gecerli: /[0-9]/.test(password) },
  ];

  // Tüm kurallar sağlandı mı?
  const tumKurallarGecerli = kurallar.every((k) => k.gecerli);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(email, password);
      navigate("/");
    } catch (err) {
      let mesaj =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Kayıt sırasında bir hata oluştu.";

      if (typeof mesaj === "string") {
        mesaj = mesaj.replace("Value error, ", "");
      } else {
        mesaj = "Kayıt başarısız.";
      }

      setError(mesaj);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Kayıt Ol
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Canlı kural göstergesi - sadece kullanıcı yazmaya başlayınca görünür */}
            {password.length > 0 && (
              <ul className="mt-2 space-y-1">
                {kurallar.map((kural, i) => (
                  <li
                    key={i}
                    className={`text-xs flex items-center gap-2 ${
                      kural.gecerli ? "text-green-600" : "text-slate-400"
                    }`}
                  >
                    <span>{kural.gecerli ? "✓" : "○"}</span>
                    {kural.etiket}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !tumKurallarGecerli}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Zaten hesabınız var mı?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;