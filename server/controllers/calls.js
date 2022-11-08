const callsModel = require("../models/calls");
class Calls {
  //当用户申请通话的时候要把相关数据添加到数据库
  static async insertCall(ctx) {
    let { phone, roomId, peerId } = ctx.request.body;
    const result = callsModel.insertMany({
      phone,
      state: 0,
      other: "",
      roomId,
      peerId,
    });
    ctx.body = {
      err: 0,
      msg: "新增通话成功",
      data: result,
    };
  }

  //新增通话之前要查询数据库是否有这个状态
  static async getCall(ctx) {
    const callInfo = await callsModel.find({ phone: ctx.request.body.phone });
    ctx.body = {
      err: 0,
      msg: "查找成功",
      data: callInfo,
    };
  }

  //当连接到用户之后 要修改用户通话状态
  static async changeCallState(ctx) {
    await callsModel
      .where({
        phone: ctx.request.body.phone,
      })
      .updateOne({
        other: ctx.request.body.other,
        state: 1,
      });
    const results = await callsModel.find({ phone: ctx.request.body.phone });
    ctx.body = {
      err: 0,
      results,
    };
  }

  //判断有该用户通话记录的时候 要修改peerjs 这个是针对用户处于通话页面时刷新页面拥有新的peerId
  static async changeCallPeerId(ctx) {
    await callsModel
      .where({
        phone: ctx.request.body.phone,
      })
      .updateOne({
        peerId: ctx.request.body.peerId,
      });
    const results = await callsModel.find({ phone: ctx.request.body.phone });
    ctx.body = {
      err: 0,
      results,
    };
  }
  //获取处于同一标签下且state为0的用户
  static async getRoomWaitCall(ctx) {
    const callInfo = await callsModel.find({
      roomId: ctx.request.body.roomId,
      state: 0,
    });
    ctx.body = {
      err: 0,
      msg: "查找成功",
      data: callInfo,
    };
  }
  //两个人连接上通话的时候要把他们的state改成1
  static async changeState(ctx) {
    const callRes = await callsModel
      .where({
        phone: ctx.request.body.phone,
      })
      .updateOne({
        state: 1,
      });
    ctx.body = {
      err:0,
      callRes
    }
  }

  //通话结束的时候 把当前用户删除
  static async callDel(ctx) {
    let result = await callsModel
      .where({
        phone: ctx.request.body.phone,
      })
      .deleteOne();

    ctx.body = {
      err: 0,
      result,
    };
  }
}

module.exports = Calls;
