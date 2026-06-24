import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Marka */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              🏪 Özkan Shopping
            </h3>
            <p className="text-sm text-slate-400">
              Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat. Alışverişin
              keyifli adresi.
            </p>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="font-semibold text-white mb-3">İletişim</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>📍 Kocaeli, Türkiye</li>
              <li>📞 0262 123 45 67</li>
              <li>✉️ info@ozkanshopping.com</li>
            </ul>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h4 className="font-semibold text-white mb-3">Kurumsal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt çizgi */}
        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-500">
          © 2026 Özkan Shopping. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}

export default Footer;