import { io } from "socket.io-client";

const socket = io("http://adrien-serv.ddns.net/messages_socket", {
  autoConnect: false, // on connectera manuellement après avoir le user.id
});

export default socket;
