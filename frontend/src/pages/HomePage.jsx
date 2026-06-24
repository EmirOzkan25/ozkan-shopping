import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import toast from "react-hot-toast";
import Carousel from "../components/Carousel";
import { useSearch } from "../context/SearchContext";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { searchTerm } = useSearch();

  // --- VERİLER ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FİLTRE DURUMLARI ---
  const [selectedCategory, setSelectedCategory] = useState(null); // null = hepsi
  const [maxPrice, setMaxPrice] = useState(""); // boş = sınır yok
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState("default"); // default | price-asc | price-desc
  // Debounce için: gecikmeli arama metni
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Sayfa açılınca ürünleri ve kategorileri çek
  useEffect(() => {
    Promise.all([api.get("/products"), api.get("/categories")])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Veriler yüklenirken bir hata oluştu.");
        setLoading(false);
      });
  }, []);
  // DEBOUNCE: kullanıcı yazmayı bırakınca 300ms sonra aramayı uygula
  useEffect(() => {
    const zamanlayici = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(zamanlayici);
  }, [searchTerm]);

  // --- FİLTRELEME (frontend'de) ---
  let filtered = [...products];

  // Arama filtresi (2+ harf, isim içinde geçen, büyük/küçük harf önemsiz)
  if (debouncedSearch.trim().length >= 2) {
    const aranan = debouncedSearch.trim().toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(aranan)
    );
  }

  // Kategori filtresi
  if (selectedCategory !== null) {
    filtered = filtered.filter((p) => p.category_id === selectedCategory);
  }

  // Maksimum fiyat filtresi
  if (maxPrice !== "") {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  // Sadece stokta olanlar
  if (onlyInStock) {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  // Sıralama
  if (sortBy === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }
  function handleFavorite(e, productId) {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (isFavorite(productId)) {
      toggleFavorite(productId);
      toast("Favorilerden çıkarıldı", { icon: "💔", id: "favori" });
    } else {
      toggleFavorite(productId);
      toast("Favorilere eklendi", { icon: "❤️", id: "favori" });
    }
  }

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* CAROUSEL - sadece arama yapılmıyorken görünsün */}
      {debouncedSearch.trim().length < 2 && <Carousel products={products} />}

      {/* FİLTRE + ÜRÜNLER */}
      <div className="flex gap-8">
        {/* SOL: FİLTRE PANELİ */}
      <aside className="w-64 shrink-0">
        <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
          <h2 className="font-bold text-slate-800 mb-4">Filtrele</h2>

          {/* Kategori */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Kategori</h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm mb-1 ${
                selectedCategory === null
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm mb-1 ${
                  selectedCategory === cat.id
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Maksimum Fiyat */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">
              Maksimum Fiyat
            </h3>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="örn. 5000"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Stok */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              Sadece stokta olanlar
            </label>
          </div>

          {/* Sıralama */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Sıralama</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="default">Varsayılan</option>
              <option value="price-asc">Fiyat (Artan)</option>
              <option value="price-desc">Fiyat (Azalan)</option>
            </select>
          </div>
        </div>
      </aside>

      {/* SAĞ: ÜRÜNLER */}
      <main className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Ürünler</h1>
          <span className="text-sm text-slate-500">{filtered.length} ürün</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            Bu kriterlere uygun ürün bulunamadı.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition block relative"
              >
                <button
                  onClick={(e) => handleFavorite(e, product.id)}
                  className="absolute top-3 right-3 text-xl hover:scale-110 transition"
                  title="Favori"
                >
                  {isFavorite(product.id) ? "❤️" : "🤍"}
                </button>
                <div className="h-40 bg-slate-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML =
                          '<span class="text-4xl">📦</span>';
                      }}
                    />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-slate-800 pr-8">
                  {product.name}
                </h2>
                <p className="text-slate-500 text-sm mt-1 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    {product.price.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="text-xs text-slate-400">
                    Stok: {product.stock}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}

export default HomePage;