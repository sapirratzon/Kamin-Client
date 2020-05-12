import io from 'socket.io-client'

const socketConnection = io(process.env.REACT_APP_API);

export default socketConnection;