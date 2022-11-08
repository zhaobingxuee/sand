const koaRouter = require("koa-router");
const router = new koaRouter();

const Cu = require("../controllers/user"); //导入控制器中的方法
const Code = require('../controllers/getCode')
const Rooms = require('../controllers/rooms')
const Calls = require('../controllers/calls')

// //跨域
// router.use(async (ctx, next) => {
//   ctx.res.setHeader("Access-Control-Allow-Origin", "*");
//   ctx.res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
//   ctx.res.setHeader(
//     "Access-Control-Allow-Methods",
//     "PUT,POST,GET,DELETE,OPTIONS"
//   );
//   ctx.res.setHeader("X-Powered-By", " 3.2.1");
//   ctx.res.setHeader("Content-Type", "text/css");
//   try {
//     await next();
//     if (ctx.body !== undefined) {
//       ctx.status = 200;
//       ctx.body = {
//         code: 200,
//         message: "成功",
//         data: ctx.body,
//       };
//     } else {
//       ctx.status = 404;
//       ctx.body = {
//         code: 404,
//         message: "date not fiend",
//         data: ctx.body,
//       };
//     }
//   } catch (e) {
//     console.log(e.message);
//     ctx.status = 500;
//     ctx.body = {
//       code: 500,
//       message: "服务器错误",
//       data: {},
//     };
//   }
// });


//根据用户手机号获取用户信息 params:{phone:string}
router.get("/getUser", Cu.getUser);

//添加用户 query:{phone:string,password:string}
router.post("/insertUser", Cu.insertUser);

//用户修改密码 query:{phone:string,password:string}
router.post("/changePass",Cu.changePass)


//发送短信 params:{phone:string}
router.get('/sendCode',Code.sendCode)

//根据手机号 获取验证码信息 params:{phone:string}
router.get('/checkCode',Code.checkCode)

//查询所有的标签 还没有分页
router.get('/getAllRooms',Rooms.getAllRooms)
//新增标签 query:{name:strng}
router.post('/addRoom',Rooms.addRoom)


/*
  以下为Calls表的相关方法！！！
*/
//新增通话 {phone:string,roomId:string,peerId:string}
router.post('/addCall',Calls.insertCall)

//修改通话状态 {phone:string,other:string}
router.post('/changeCallState',Calls.changeCallState)

//修改用户的peerId {phone:string,peerId:string}
router.post('/changeCallPeerId',Calls.changeCallPeerId)

//删除通话 {phone:string}
router.post('/callDel',Calls.callDel)

//查询通话 {phone:string}
router.post('/getCall',Calls.getCall)

//获取同处于一个标签中且state=0的通话记录 {roomId:string}
router.post('/getRoomWaitCall',Calls.getRoomWaitCall)

//修改用户通话等待状态 {phone:string}
router.post('/changeState',Calls.changeState)




module.exports = router;
