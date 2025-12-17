import { useEffect, useState } from 'react';
import { webSocketService } from '../services/websocket';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(webSocketService.isConnected());

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    webSocketService.on('connected', handleConnect);
    webSocketService.on('disconnected', handleDisconnect);

    return () => {
      webSocketService.off('connected', handleConnect);
      webSocketService.off('disconnected', handleDisconnect);
    };
  }, []);

  return {
    isConnected,
    connect: webSocketService.connect,
    disconnect: webSocketService.disconnect,
    on: webSocketService.on,
    off: webSocketService.off
  };
};