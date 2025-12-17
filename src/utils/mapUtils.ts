import type { Cart, CartLocation } from '../types/cart';
import type { LngLatBoundsLike } from 'mapbox-gl';

export const calculateBounds = (locations: CartLocation[]): LngLatBoundsLike | null => {
  if (locations.length === 0) return null;

  const lngs = locations.map(loc => loc.longitude);
  const lats = locations.map(loc => loc.latitude);
 
  const padding = 0.01; // ~1km padding
 
  return [
    [Math.min(...lngs) - padding, Math.min(...lats) - padding], // southwest
    [Math.max(...lngs) + padding, Math.max(...lats) + padding]  // northeast
  ];
};

export const clusterCarts = (carts: Cart[], zoom: number): any[] => {
  if (zoom > 14) return carts.map(cart => ({ ...cart, cluster: false }));

  const clusters = [];
  const processed = new Set();

  for (let i = 0; i < carts.length; i++) {
    if (processed.has(i)) continue;

    const cart = carts[i];
    if (!cart.current_location) continue;

    const cluster = [cart];
    processed.add(i);

    for (let j = i + 1; j < carts.length; j++) {
      if (processed.has(j)) continue;

      const otherCart = carts[j];
      if (!otherCart.current_location) continue;

      const distance = calculateDistance(
        cart.current_location.latitude,
        cart.current_location.longitude,
        otherCart.current_location.latitude,
        otherCart.current_location.longitude
      );

      if (distance < 100) { // 100 meters cluster radius
        cluster.push(otherCart);
        processed.add(j);
      }
    }

    if (cluster.length > 1) {
      clusters.push({
        cluster: true,
        count: cluster.length,
        carts: cluster,
        latitude: cluster.reduce((sum, c) => sum + c.current_location!.latitude, 0) / cluster.length,
        longitude: cluster.reduce((sum, c) => sum + c.current_location!.longitude, 0) / cluster.length
      });
    } else {
      clusters.push({ ...cart, cluster: false });
    }
  }

  return clusters;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};