import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // Giriş bilgisi henüz yükleniyorsa bekle
  if (loading) {
    return <div className="p-10 text-center text-slate-500">Yükleniyor...</div>;
  }

  // Giriş yok veya admin değilse → ana sayfaya at
  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  // Admin ise → içeriği göster
  return children;
}

export default AdminRoute;