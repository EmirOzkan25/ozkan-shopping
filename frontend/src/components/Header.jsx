import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";

function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();

  // Çıkış onay penceresi açık mı?
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function handleLogout() {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-blue-600 shrink-0">
            🏪 Özkan Shopping
          </Link>

          {/* ARAMA ÇUBUĞU */}
          <div className="flex-1 max-w-xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* SAĞ TARAF */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Sepet */}
            <Link
              to="/cart"
              className="relative text-slate-600 hover:text-blue-600 font-medium"
            >
              🛒 Sepet
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  to="/favorites"
                  className="text-slate-600 hover:text-red-500 font-medium"
                >
                  ❤️ Favoriler
                </Link>
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className="text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Admin Paneli
                  </Link>
                )}
                <span className="text-slate-600 text-sm hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="text-slate-600 hover:text-red-600 font-medium"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-blue-600 font-medium"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ÇIKIŞ ONAY PENCERESİ (MODAL) */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Çıkış Yap
            </h2>
            <p className="text-slate-500 mb-6">
              Çıkış yapmak istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
              >
                Vazgeç
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;