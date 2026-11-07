import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ScrollToTop } from './components/common/ScrollToTop';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
