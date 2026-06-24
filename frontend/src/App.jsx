import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FavoritesPage from "./pages/FavoritesPage";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import { SearchProvider } from "./context/SearchContext";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <SearchProvider>
          <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-slate-50">
            <Toaster position="top-center" />
            <Header />

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
            </Routes>
            <Footer />
          </div>
          </BrowserRouter>
        </CartProvider>
        </SearchProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;