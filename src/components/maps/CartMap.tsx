import React, { useState, useCallback, useEffect, useRef } from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  ScaleControl,
  type ViewStateChangeEvent
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { Cart } from '../../types/cart';
import { CartMarker } from './CartMarker';
import { MapControls } from './MapControls';
import { MAPBOX_ACCESS_TOKEN } from '../../utils/constants';
import { useMap } from '../../hooks/useMap';

interface CartMapProps {
  carts: Cart[];
}

export const CartMap: React.FC<CartMapProps> = ({ carts }) => {
  const {
    viewport,
    setViewport,
    selectedCart,
    setSelectedCart,
    handleCartSelect,
    getClusteredCarts,
    fitMapToCarts
  } = useMap();

  const [showPopup, setShowPopup] = useState(true);


  // Fit map to bounds when mapBounds changes
   useEffect(() => {
    if (carts.length > 0) {
      fitMapToCarts(carts);
    }
  }, [carts, fitMapToCarts]);

  const onMapMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewport(evt.viewState);
  }, [setViewport]);

  const clusteredCarts = getClusteredCarts(carts);

  return (
    <div className="relative w-full h-full">
      <Map
        onMove={onMapMove}
        {...viewport}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        
        {/* Navigation & Scale Controls */}
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-right" />

        {/* Cart Markers */}
        {clusteredCarts.map((item) => {
          if (item.cluster) {
            return (
              <Marker
                key={`cluster-${item.latitude}-${item.longitude}`}
                latitude={item.latitude}
                longitude={item.longitude}
              >
                <div className="bg-hocco-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
                  {item.count}
                </div>
              </Marker>
            );
          }

          const cart = item as Cart;
          if (!cart.current_location) return null;

          return (
            <Marker
              key={cart.cart_id}
              latitude={cart.current_location.latitude}
              longitude={cart.current_location.longitude}
              anchor="bottom"
            >
              <CartMarker
                cart={cart}
                onClick={() => handleCartSelect(cart)}
              />
            </Marker>
          );
        })}

        {/* Selected Cart Popup */}
        {selectedCart && selectedCart.current_location && showPopup && (
          <Popup
            latitude={selectedCart.current_location.latitude}
            longitude={selectedCart.current_location.longitude}
            anchor="top"
            onClose={() => setSelectedCart(null)}
            closeOnClick={false}
          >
            <div className="p-2 min-w-48">
              <h3 className="font-semibold text-gray-900">Cart {selectedCart.cart_id}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Status: <span className="capitalize">{selectedCart.status}</span></p>
                <p>Model: {selectedCart.cart_model}</p>
                {selectedCart.current_location.is_moving && (
                  <p className="text-green-600 font-medium">Moving</p>
                )}
                <p className="text-xs text-gray-500">
                  Updated: {new Date(selectedCart.current_location.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Map Controls */}
      <MapControls
        carts={carts}
        onFitToBounds={() => { /* Implement fit to bounds */ }}
      />
    </div>
  );
};