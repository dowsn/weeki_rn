import { useCallback, useEffect, useRef, useState } from 'react';
import { host } from 'src/constants/constants';
import SecurityService from 'src/contexts/SecurityService';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

export const useAgentChat = (onStreamedResponse, chat_session_id) => {
  const websocketRef = useRef(null);
  const { user } = useUserContext();
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const intentionalClose = useRef(false);

  const connect = useCallback(async () => {
    if (!user?.userId || intentionalClose.current) return;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // Get access token from SecurityService
      const tokens = await SecurityService.getTokens();

      if (!tokens || !tokens.access) {
        console.error('No access token available for WebSocket connection');
        return;
      }

      // Include token in the URL as a query parameter
      const ws = new WebSocket(
        `wss://${host}/ws/api/chat/${chat_session_id}?token=${encodeURIComponent(tokens.access)}`,
      );

      ws.onopen = () => {
        console.log('WebSocket connection established successfully');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'connection_status':
              onStreamedResponse(data);
              break;
            case 'message':
            case 'topic':
              if (data.text) {
                console.log('Received message:', data.text);
                onStreamedResponse(data);
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
    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
      // Set up reconnection
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      }
    }
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

  const quitTopic = useCallback(() => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    )
      return;
    websocketRef.current.send(
      JSON.stringify({ type: 'topic_operation', confirm_topic: 0 }),
    );
  }, []);

  const confirmTopic = useCallback(() => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    )
      return;
    websocketRef.current.send(
      JSON.stringify({ type: 'topic_operation', confirm_topic: 1 }),
    );
  }, []);

  return {
    requestResponse,
    sendUserMessage,
    quitTopic,
    confirmTopic,
    sendCloseSignal,
    isConnected,
  };
};
