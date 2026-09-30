import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('miliva_guest_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const res = await wishlistService.getWishlist();
      if (res.wishlist) {
        setWishlist(res.wishlist);
      }
    } catch (err) {
      console.warn('Failed to fetch wishlist:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      const saved = localStorage.getItem('miliva_guest_wishlist');
      setWishlist(saved ? JSON.parse(saved) : []);
    }
  }, [user, fetchWishlist]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('miliva_guest_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product;
    const exists = isInWishlist(productId);

    if (user) {
      try {
        if (exists) {
          const res = await wishlistService.removeFromWishlist(productId);
          setWishlist(res.wishlist || []);
          showToast(`Removed ${product.name || 'item'} from wishlist`, 'info');
        } else {
          const res = await wishlistService.addToWishlist(productId);
          setWishlist(res.wishlist || []);
          showToast(`Added ${product.name || 'item'} to wishlist`, 'success');
        }
      } catch (err) {
        showToast('Failed to update wishlist', 'error');
      }
    } else {
      if (exists) {
        setWishlist((prev) => prev.filter((p) => (p._id || p) !== productId));
        showToast(`Removed ${product.name || 'item'} from wishlist`, 'info');
      } else {
        setWishlist((prev) => [...prev, product]);
        showToast(`Added ${product.name || 'item'} to wishlist`, 'success');
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
