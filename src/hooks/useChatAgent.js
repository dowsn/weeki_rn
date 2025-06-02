import { useCallback, useEffect, useRef, useState } from 'react';
import { host } from 'src/constants/constants';
import SecurityService from 'src/contexts/SecurityService';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';
import { refreshTokens } from 'src/utils/api'; // Import the refreshTokens function

export const useAgentChat = (onStreamedResponse, chat_session_id) => {
  const websocketRef = useRef(null);
  const { user } = useUserContext();
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const intentionalClose = useRef(false);

  const getRefreshedToken = async () => {
    try {
      // Get current tokens
      const tokens = await SecurityService.getTokens();

      if (!tokens || !tokens.access) {
        console.error('No access token available');
        return null;
      }

      // Check if token is expired
      const isTokenExpired = (token) => {
        if (!token) return true;

        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join(''),
          );
          const { exp } = JSON.parse(jsonPayload);

          // Return true if token is expired or will expire in the next minute
          return exp * 1000 < Date.now() + 60000;
        } catch (e) {
          console.error('Token validation error:', e);
          return true; // Assume expired if we can't validate
        }
      };

      // If the token is expired or about to expire, refresh it
      if (tokens.refresh && isTokenExpired(tokens.access)) {
        console.log(
          'Token expired or about to expire, refreshing before WebSocket connection',
        );
        try {
          const newTokens = await refreshTokens(tokens.refresh);
          await SecurityService.setTokens(newTokens);
          console.log('Token refreshed successfully for WebSocket connection');
          return newTokens.access;
        } catch (refreshError) {
          console.error('Failed to refresh token for WebSocket:', refreshError);
          await SecurityService.clearAll();
          return null;
        }
      }

      return tokens.access;
    } catch (error) {
      console.error('Error in getRefreshedToken:', error);
      return null;
    }
  };

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
      // Get a fresh token
      const accessToken = await getRefreshedToken();

      if (!accessToken) {
        console.error('No access token available for WebSocket connection');
        return;
      }

      // Include token in the URL as a query parameter
      const ws = new WebSocket(
        `wss://${host}/ws/api/chat/${chat_session_id}?token=${encodeURIComponent(accessToken)}`,
      );

      ws.onopen = () => {
        console.log('WebSocket connection established successfully');
        setIsConnected(true);

        setTimeout(() => {
          ws.send(
            JSON.stringify({
              type: 'connection_ready',
            }),
          );
        }, 100); // Small delay to ensure component is fully mounted
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'connection_status':
              onStreamedResponse(data);
              break;
            case 'new_message':
              console.log('Starting new message stream');
              onStreamedResponse(data);
              break;

            case 'timer_paused':
              console.log('Timer paused:', data.message);
              onStreamedResponse(data);
              break;
            case 'timer_resumed':
              console.log('Timer resumed:', data.message);
              onStreamedResponse(data);
              break;

            case 'stream_complete':
              console.log('Stream completed');
              // Check for topic confirmator text and pass to handler
              onStreamedResponse({
                ...data,
                type: 'stream_complete'
              });
              break;
            case 'status':
              console.log('Status:', data.message);
              break;
            case 'automatic_message':
              console.log('Automatic message:', data.message);
              onStreamedResponse(data);
              break;
            case 'stream_completed':
              console.log('Stream completed:', data.message);
              onStreamedResponse(data);
              break;
            case 'message':
            // case 'token':
            case 'topic':
              if (data.text !== undefined) {
                onStreamedResponse(data);
              }
              break;
            case 'error':
              console.log('hee');
              showAlert('Error', data.error);
              break;
            default:
              console.log('Unknown message type:', data.type, data);
          }
        } catch (err) {
          console.error('Failed to parse message:', err);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed with code:', event.code); // Add logging

        setIsConnected(false);

        // Check if the close was due to token expiration (code 4001)
        if (event.code === 4001) {
          console.log(
            'WebSocket closed due to token expiration. Refreshing token and reconnecting...',
          );
          // Immediate reconnect attempt with token refresh
          setTimeout(connect, 100);
        } else if (
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

  // Add these functions to your useAgentChat hook (paste-3.txt)

  // Add these two functions before the return statement:

  const sendPauseSignal = useCallback(() => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      console.log('Cannot send pause signal - WebSocket not connected');
      return;
    }

    console.log('Sending pause signal to backend');
    websocketRef.current.send(JSON.stringify({ type: 'pause', query: '' }));
  }, []);

  const sendResumeSignal = useCallback(() => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      console.log('Cannot send resume signal - WebSocket not connected');
      return;
    }

    console.log('Sending resume signal to backend');
    websocketRef.current.send(JSON.stringify({ type: 'resume', query: '' }));
  }, []);

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



  const sendEndSignal = useCallback(() => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    intentionalClose.current = true;
    websocketRef.current.send(JSON.stringify({ type: 'end', query: 'end' }));
    // websocketRef.current.close(1000, 'Session ended'); // ← Add this line
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
      JSON.stringify({
        type: 'topic_operation',
        topic_confirmation: 0,
        query: 'x',
      }),
    );
  }, []);

  const confirmTopic = useCallback(() => {
    if (
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    )
      return;
    websocketRef.current.send(
      JSON.stringify({
        type: 'topic_operation',
        topic_confirmation: 1,
        query: 'x',
      }),
    );
  }, []);

  return {
    requestResponse,
    sendUserMessage,
    quitTopic,
    confirmTopic,
    sendCloseSignal,
    sendEndSignal,
    sendPauseSignal, // ✅ Add this
    sendResumeSignal,
    isConnected,
  };
};