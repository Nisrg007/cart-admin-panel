
export const mapsService = {
  initializeMapbox(): void {
    // Mapbox initialization if needed
  },

  getMapStyle(): string {
    return 'mapbox://styles/mapbox/light-v11';
  },

  generateMarkerHTML(status: string, isMoving: boolean = false): string {
    const color = status === 'active' 
      ? (isMoving ? '#10B981' : '#3B82F6') 
      : status === 'maintenance' 
        ? '#F59E0B' 
        : '#EF4444';
    
    return `
      <div style="
        width: 20px;
        height: 20px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ${isMoving ? 'animation: pulse 1.5s infinite;' : ''}
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      </style>
    `;
  }
};