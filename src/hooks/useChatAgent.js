// import { useCallback, useEffect, useRef, useState } from 'react';
// import { host } from 'src/constants/constants';
// import { useUserContext } from 'src/hooks/useUserContext';
// import { DebugLogger } from 'src/utils/DebugLogger';

// export const useAgentChat = (onStreamedResponse, chat_session_id) => {
//   const websocketRef = useRef(null);
//   const { user } = useUserContext();
//   const [isConnected, setIsConnected] = useState(false);
//   const reconnectTimeoutRef = useRef(null);
//   const intentionalClose = useRef(false);

//   const connect = useCallback(() => {
//     try {
//       if (!user?.userId || intentionalClose.current) {
//         DebugLogger.log('Connect aborted - no user ID or intentional close');
//         return;
//       }

//       const wsUrl = `wss://${host}/ws/api/chat/${user.userId}/${chat_session_id}`;
//       DebugLogger.log(`Attempting connection to: ${wsUrl}`);

//       const ws = new WebSocket(wsUrl);

//       ws.onopen = () => {
//         DebugLogger.log('WebSocket connected successfully');
//         setIsConnected(true);
//       };

//       ws.onerror = (error) => {
//         DebugLogger.log(`WebSocket error: ${JSON.stringify(error)}`, 'error');
//       };

//       ws.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           DebugLogger.log(`Received message type: ${data.type}`);

//           if (data.type === 'error') {
//             DebugLogger.log(`Server error: ${data.error}`, 'error');
//           }

//           onStreamedResponse(data);
//         } catch (err) {
//           DebugLogger.log(`Message parsing error: ${err.message}`, 'error');
//         }
//       };

//       ws.onclose = (event) => {
//         DebugLogger.log(`WebSocket closed with code: ${event.code}`);
//         setIsConnected(false);

//         if (
//           !intentionalClose.current &&
//           event.code !== 1000 &&
//           !reconnectTimeoutRef.current
//         ) {
//           DebugLogger.log('Scheduling reconnection...');
//           reconnectTimeoutRef.current = setTimeout(connect, 5000);
//         }
//       };

//       websocketRef.current = ws;
//     } catch (error) {
//       DebugLogger.log(`Connection error: ${error.message}`, 'error');
//     }
//   }, [user?.userId, chat_session_id, onStreamedResponse]);

//   const sendCloseSignal = useCallback(() => {
//     try {
//       if (
//         !websocketRef.current ||
//         websocketRef.current.readyState !== WebSocket.OPEN
//       ) {
//         return;
//       }

//       DebugLogger.log('Sending close signal');
//       intentionalClose.current = true;
//       websocketRef.current.send(
//         JSON.stringify({ type: 'close', query: 'close' }),
//       );
//       websocketRef.current.close(1000, 'Intentional close');
//     } catch (error) {
//       DebugLogger.log(`Close signal error: ${error.message}`, 'error');
//     }
//   }, []);

//   useEffect(() => {
//     connect();
//     return () => {
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//       if (websocketRef.current) {
//         websocketRef.current.close(1000, 'Component unmounting');
//       }
//     };
//   }, [connect]);

//   const requestResponse = useCallback((text) => {
//     try {
//       if (
//         !websocketRef.current ||
//         websocketRef.current.readyState !== WebSocket.OPEN
//       ) {
//         DebugLogger.log('Cannot send message - WebSocket not open');
//         return;
//       }
//       DebugLogger.log('Sending assistant message');
//       websocketRef.current.send(
//         JSON.stringify({ query: text.trim(), type: 'assistant' }),
//       );
//     } catch (error) {
//       DebugLogger.log(`Send message error: ${error.message}`, 'error');
//     }
//   }, []);

//   const sendUserMessage = useCallback((text) => {
//     try {
//       if (
//         !websocketRef.current ||
//         websocketRef.current.readyState !== WebSocket.OPEN
//       ) {
//         DebugLogger.log('Cannot send message - WebSocket not open');
//         return;
//       }
//       DebugLogger.log('Sending user message');
//       websocketRef.current.send(
//         JSON.stringify({ query: text.trim(), type: 'user' }),
//       );
//     } catch (error) {
//       DebugLogger.log(`Send message error: ${error.message}`, 'error');
//     }
//   }, []);

//   return { requestResponse, sendUserMessage, sendCloseSignal, isConnected };
// };

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
