import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Giriş yapmış kullanıcı bilgisi (null = giriş yok)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa açılınca: token varsa kullanıcıyı geri getir
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/profilim")
        .then((response) => setUser(response.data))
        .catch(() => {
          // Token geçersizse temizle
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // GİRİŞ YAP
  async function login(email, password) {
    // Backend OAuth2 formu "username" bekliyor (biz e-posta veriyoruz)
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post("/login", formData);
    const token = response.data.access_token;

    // Token'ı sakla
    localStorage.setItem("token", token);

    // Kullanıcı bilgisini çek
    const profil = await api.get("/profilim");
    setUser(profil.data);
  }

  // KAYIT OL
  async function register(email, password) {
    await api.post("/register", { email, password });
    // Kayıttan sonra otomatik giriş yap
    await login(email, password);
  }

  // ÇIKIŞ YAP
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}