import { useEffect, useState } from "react";

const WS_URL = "https://probable-orbit-59g95jvqvq4hpx7x-8080.app.github.dev/";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let isConnected = false;
    const ws = new WebSocket(`${WS_URL}`);

    ws.onopen = () => {
      if (!isConnected) {
        isConnected = true;
        setSocket(ws);
        console.log("WebSocket connection established");
      }
    };

    ws.onclose = () => {
      if (isConnected) {
        isConnected = false;
        setSocket(null);
        console.log("WebSocket connection closed");
      }
    };

    return () => {
      ws.close();
      console.log("Cleaning up WebSocket connection");
    };
  }, []);

  return socket;
};
