import { useCallback, useEffect, useRef } from 'react';
import { host } from 'src/constants/constants';
import { useUserContext } from 'src/hooks/useUserContext';
import { showAlert } from 'src/utils/alert';

export const useAgentChat = (onStreamedResponse) => {
  const websocketRef = useRef(null);
  const { user } = useUserContext();

  const connect = useCallback(() => {
    if (!user?.userId) return;

    const ws = new WebSocket(`ws://${host}/ws/api/chat/${user.userId}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          showAlert('Error', data.error);
          return;
        }
        onStreamedResponse(data.text || '');
      } catch (err) {
        showAlert('Error', 'Failed to parse message');
      }
    };

    websocketRef.current = ws;
  }, [user?.userId, onStreamedResponse]);

  const sendMessage = useCallback((text) => {
    if (!websocketRef.current || !text.trim()) return;
    websocketRef.current.send(JSON.stringify({ query: text.trim() }));
  }, []);

  useEffect(() => {
    connect();
    return () => websocketRef.current?.close();
  }, [connect]);

  return { sendMessage };
};
