import { useState, useCallback } from 'react';
import type { Cart, CartLocation } from '../types/cart';
import { calculateBounds, clusterCarts } from '../utils/mapUtils';

export const useMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 0,  // ✅ Start at 0,0 instead of New York
    longitude: 0,
    zoom: 2
  });
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [mapBounds, setMapBounds] = useState<any>(null);

    const fitMapToCarts = useCallback((carts: Cart[]) => {
    const locations = carts
      .filter(cart => cart.current_location)
      .map(cart => cart.current_location!) as CartLocation[];
    
    if (locations.length === 0) return;

    const bounds = calculateBounds(locations) as [[number, number], [number, number]];
    if (bounds) {
      setMapBounds(bounds);
      
      // ✅ Calculate center point for better initial view
      const centerLat = (bounds[0][1] + bounds[1][1]) / 2;
      const centerLng = (bounds[0][0] + bounds[1][0]) / 2;
      
      setViewport(prev => ({
        ...prev,
        latitude: centerLat,
        longitude: centerLng,
        zoom: 12 // Good zoom level for city-scale viewing
      }));
    }
  }, []);

  const handleCartSelect = useCallback((cart: Cart) => {
    setSelectedCart(cart);
    if (cart.current_location) {
      setViewport(prev => ({
        ...prev,
        latitude: cart.current_location!.latitude,
        longitude: cart.current_location!.longitude,
        zoom: 15
      }));
    }
  }, []);

  const getClusteredCarts = useCallback((carts: Cart[]) => {
    return clusterCarts(carts, viewport.zoom);
  }, [viewport.zoom]);

  return {
    viewport,
    setViewport,
    selectedCart,
    setSelectedCart,
    mapBounds,
    fitMapToCarts,
    handleCartSelect,
    getClusteredCarts
  };
};