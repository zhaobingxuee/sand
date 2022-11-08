const IO = require("socket.io");
const log4js = require("log4js");
let logger = log4js.getLogger();
logger.level = "debug";

const roomsInfo = {};
const userRoomInfo = {};
function creatSocket(app) {
  const io = IO(app);
  io.on("connection", async (socket) => {
    console.log("连接到ws，id", socket.id);
    // socket.on("join", (room) => {
    //   console.log(`用户${socket.id}进入房间${room}`);
    //   socket.join(room);

    //   socket.on("interact", function (data) {
    //     console.log(data);
    //     //向room房间内的所有人注册interact事件
    //     socket.to(room).emit("interact", data);
    //   });
    //   socket.on("agree interact", function (data) {
    //     console.log("同意视频", data);
    //     socket.to(room).emit("agree interact", data);
    //   });

    //   // 收到对等连接创建的消息
    //   socket.on("pc message", function (data) {
    //     socket.to(data.to).emit("pc message", data);
    //     // socket.broadcast.to(room).emit('pc message', data);
    //   });
    // });
    socket.on("join", (room) => {
      socket.join(room); //加入房间 后面要对人员数量进行处理
      console.log(`用户${socket.id}进入房间${room}`);
      //用户进入房间之后要发送事件给房间内所有用户
      socket.broadcast.to(room).emit('comeIn',`有人进入到当前房间`)
      // socket.broadcast.to(room).emit('changeStream',socket.id)

      //要实现的功能是：当双方用户有一个人切换视频流时，要让对方和本人都监听到
      //用户关闭摄像头
      socket.on('changeStream',data => {
        console.log(data)
        socket.broadcast.to(room).emit('changeStream',data)
      })
      socket.on('openVideo',data => {
        socket.broadcast.to(room).emit('openVideo',data)
      })
      socket.on('closeVideo',data => {
        socket.broadcast.to(room).emit('closeVideo',data)
      })
      socket.on('openAudio',data => {
        socket.broadcast.to(room).emit('openAudio',data)
      })
      socket.on('closeAudio',data => {
        socket.broadcast.to(room).emit('closeAudio',data)
      })
    });
    // socket.to()
  });
}

module.exports = creatSocket;
