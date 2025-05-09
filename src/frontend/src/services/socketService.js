import { io } from 'socket.io-client';

// Socket instance
let socket = null;

// Initialize socket connection
const initSocket = (token) => {
  if (!token) {
    console.error('Cannot initialize socket: No token provided');
    return null;
  }
  
  // Close existing connection if any
  if (socket) {
    socket.disconnect();
  }
  
  // Create new connection
  const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
  
  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  });
  
  // Connection event handlers
  socket.on('connect', () => {
    console.log('Socket connected');
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });
  
  return socket;
};

// Disconnect socket
const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};

// Join course room
const joinCourseRoom = (courseId) => {
  if (socket) {
    socket.emit('join:course', courseId);
  }
};

// Leave course room
const leaveCourseRoom = (courseId) => {
  if (socket) {
    socket.emit('leave:course', courseId);
  }
};

export {
  socket,
  initSocket,
  disconnectSocket,
  joinCourseRoom,
  leaveCourseRoom
};
