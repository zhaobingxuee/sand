const koa = require("koa"); //导入koa
const app = new koa(); //实例化koa
const path = require("path"); //路径

//socket.io
const server = require("http").createServer(app.callback());
creatSocket = require("./socketIO/socket"); //引入socket
creatSocket(server,{
  "force new connection" : true,
  "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
  "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
  "transports" : ["websocket"]
});
server.listen(8081);

//静态资源
// const koa_static =require('koa-static')
// app.use(koa_static(path.resolve(__dirname,'./public/')))
// 可以简化为
app.use(require("koa-static")(path.resolve(__dirname, "public")));

const cors = require("./middlewares/koa-cors");
app.use(cors); // 跨域

//链接数据库 这里以MongoDB为例
require("./utils/connect");

//加载解析post的body数据中的中间件
app.use(require("koa-body")());

//开放动态API接口
app.use(require("./router/index").routes());
//开启监听
app.listen(8080, () => console.log("http://localhost:8080"));
