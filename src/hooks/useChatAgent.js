import { useCallback, useEffect, useRef, useState } from 'react';
import { host } from 'src/constants/constants';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

export const useAgentChat = (onStreamedResponse, chat_session_id) => {
  const websocketRef = useRef(null);
  const { user } = useUserContext();
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    if (!user?.userId) return;

    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Don't create a new connection if we already have one
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    console.log(
      `Connecting to WebSocket: wss://${host}/ws/api/chat/${user.userId}/${chat_session_id}`,
    );
    const ws = new WebSocket(
      `wss://${host}/ws/api/chat/${user.userId}/${chat_session_id}`,
    );

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);

        switch(data.type) {
          case 'connection_status':
            console.log('Connection status:', data.message);
            break;

          case 'token':
            if (data.token) {
              onStreamedResponse(data.token);
            }
            break;

          case 'stream_complete':
            console.log('Stream completed');
            break;

          case 'error':
            console.error('Server error:', data.error);
            showAlert('Error', data.error);
            break;

          case 'status':
            console.log('Status:', data.message);
            break;
        }
      } catch (err) {
        console.error('Failed to parse message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setIsConnected(false);

      // Only attempt to reconnect if it wasn't a normal closure
      if (event.code !== 1000 && !reconnectTimeoutRef.current) {
        console.log('Scheduling reconnection...');
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 5000);
      }
    };

    websocketRef.current = ws;
  }, [user?.userId, onStreamedResponse]);

  const sendMessage = useCallback((text) => {
    if (!websocketRef.current || !text.trim()) return;
    if (websocketRef.current.readyState !== WebSocket.OPEN) {
      showAlert('Error', 'WebSocket is not connected');
      return;
    }
    websocketRef.current.send(JSON.stringify({ query: text.trim() }));
  }, []);

  useEffect(() => {
    connect();
    return () => {
      console.log('Cleaning up WebSocket connection');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (websocketRef.current) {
        websocketRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [connect]);

  return { sendMessage, isConnected };
};
