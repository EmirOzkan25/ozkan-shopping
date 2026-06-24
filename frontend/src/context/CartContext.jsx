import { createContext, useContext, useState } from "react";

// Sepet için bir "context" (global alan) oluştur
const CartContext = createContext();

// Sepet sağlayıcısı - uygulamayı saracak
export function CartProvider({ children }) {
  // Sepetteki ürünler: [{ id, name, price, quantity }, ...]
  const [cartItems, setCartItems] = useState([]);

  // Sepete ürün ekle
  function addToCart(product) {
    setCartItems((prev) => {
      // Bu ürün sepette zaten var mı?
      const mevcut = prev.find((item) => item.id === product.id);

      if (mevcut) {
        // Varsa adedini 1 artır
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Yoksa yeni ekle (adet 1)
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  }

  // Sepetten ürünü tamamen çıkar
  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }

  // Bir ürünün adedini değiştir
  function updateQuantity(productId, yeniAdet) {
    if (yeniAdet < 1) return; // 1'in altına inmesin
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: yeniAdet } : item
      )
    );
  }

  // Sepeti tamamen boşalt
  function clearCart() {
    setCartItems([]);
  }

  // Sepetteki toplam ürün adedi (header'daki rozet için)
  const totalItems = cartItems.reduce((toplam, item) => toplam + item.quantity, 0);

  // Sepetin toplam fiyatı
  const totalPrice = cartItems.reduce(
    (toplam, item) => toplam + item.price * item.quantity,
    0
  );

  // Tüm bu değerleri ve fonksiyonları dışarı açıyoruz
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Kolay kullanım için özel bir hook
export function useCart() {
  return useContext(CartContext);
}