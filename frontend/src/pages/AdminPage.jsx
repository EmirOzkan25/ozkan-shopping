import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form durumu (hem ekleme hem düzenleme için)
  const [duzenlenenId, setDuzenlenenId] = useState(null); // null = yeni ekleme
  const [form, setForm] = useState({
    name: "",
    description: "",
    image_url: "",
    price: "",
    stock: "",
    category_id: "",
  });

  // Verileri çek
  function veriYukle() {
    Promise.all([api.get("/products"), api.get("/categories")])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    veriYukle();
  }, []);

  // Form alanı değişince
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Formu sıfırla
  function formSifirla() {
    setForm({ name: "", description: "", image_url: "", price: "", stock: "", category_id: "" });
    setDuzenlenenId(null);
  }

  // Ürün ekle veya güncelle
  async function handleSubmit(e) {
    e.preventDefault();

    const veri = {
      name: form.name,
      description: form.description,
      image_url: form.image_url || null,
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: form.category_id ? Number(form.category_id) : null,
    };

    try {
      if (duzenlenenId) {
        // GÜNCELLE
        await api.put(`/products/${duzenlenenId}`, veri);
        toast.success("Ürün güncellendi");
      } else {
        // EKLE
        await api.post("/products", veri);
        toast.success("Ürün eklendi");
      }
      formSifirla();
      veriYukle();
    } catch (err) {
      const mesaj =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "İşlem başarısız.";
      toast.error(typeof mesaj === "string" ? mesaj.replace("Value error, ", "") : "Hata");
    }
  }

  // Düzenleme moduna geç (formu doldur)
  function handleEdit(urun) {
    setDuzenlenenId(urun.id);
    setForm({
      name: urun.name,
      description: urun.description || "",
      image_url: urun.image_url || "",
      price: urun.price,
      stock: urun.stock,
      category_id: urun.category_id || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Ürün sil
  async function handleDelete(id) {
    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Ürün silindi");
      veriYukle();
    } catch {
      toast.error("Silme başarısız.");
    }
  }

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Admin Paneli
      </h1>

      {/* ÜRÜN FORMU */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="font-bold text-slate-800 mb-4">
          {duzenlenenId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ürün adı"
            required
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Kategori seçin</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="Fiyat (₺)"
            required
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stok"
            required
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="Resim URL (https://...)"
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 sm:col-span-2"
          />
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700"
            >
              {duzenlenenId ? "Güncelle" : "Ekle"}
            </button>
            {duzenlenenId && (
              <button
                type="button"
                onClick={formSifirla}
                className="border border-slate-200 text-slate-600 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50"
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ÜRÜN LİSTESİ */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <h2 className="font-bold text-slate-800 p-6 pb-3">
          Ürünler ({products.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-6 py-3">Ürün</th>
                <th className="px-6 py-3">Fiyat</th>
                <th className="px-6 py-3">Stok</th>
                <th className="px-6 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map((urun) => (
                <tr key={urun.id} className="border-t border-slate-100">
                  <td className="px-6 py-3 font-medium text-slate-800">
                    {urun.name}
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {urun.price.toLocaleString("tr-TR")} ₺
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={
                        urun.stock === 0 ? "text-red-500" : "text-slate-600"
                      }
                    >
                      {urun.stock}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(urun)}
                      className="text-blue-600 hover:underline"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(urun.id)}
                      className="text-red-500 hover:underline"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;