import { useCallback, useEffect, useRef, useState } from 'react';
import { host } from 'src/constants/constants';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

export const useAgentChat = (onStreamedResponse, chat_session_id) => {
  const websocketRef = useRef(null);
  const { user } = useUserContext();
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const intentionalClose = useRef(false);

  const connect = useCallback(() => {
    if (!user?.userId || intentionalClose.current) return;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket(
      `wss://${host}/ws/api/chat/${user.userId}/${chat_session_id}`,
    );

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'connection_status':
            onStreamedResponse(data);
            break;
          case 'token':
            if (data.token) {
              onStreamedResponse(data.token);
            }
            break;
          case 'error':
            showAlert('Error', data.error);
            break;
        }
      } catch (err) {
        console.error('Failed to parse message:', err);
      }
    };

    ws.onclose = (event) => {
      setIsConnected(false);

      if (
        !intentionalClose.current &&
        event.code !== 1000 &&
        !reconnectTimeoutRef.current
      ) {
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      }
    };

    websocketRef.current = ws;
  }, [user?.userId, chat_session_id, onStreamedResponse]);

  const sendCloseSignal = useCallback(() => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    intentionalClose.current = true;
    websocketRef.current.send(
      JSON.stringify({ type: 'close', query: 'close' }),
    );
    websocketRef.current.close(1000, 'Intentional close');
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (websocketRef.current) {
        websocketRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [connect]);

  const requestResponse = useCallback((text) => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    )
      return;
    websocketRef.current.send(
      JSON.stringify({ query: text.trim(), type: 'assistant' }),
    );
  }, []);

  const sendUserMessage = useCallback((text) => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    )
      return;
    websocketRef.current.send(
      JSON.stringify({ query: text.trim(), type: 'user' }),
    );
  }, []);

  return { requestResponse, sendUserMessage, sendCloseSignal, isConnected };
};
