import io from "socket.io-client";
module.exports = function (href) {
  let socket = io(href)
  return socket
}