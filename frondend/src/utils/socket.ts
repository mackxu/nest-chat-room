import { io } from 'socket.io-client';

export const socket = io('ws://localhost:3001', {
  autoConnect: false,
  // transports: ['websocket'],
  auth: (cb: (token: object) => void) => {
    cb({ token: localStorage.getItem('token') });
  },
});
