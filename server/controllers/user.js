const userModel = require("../models/user");
const axios = require("axios");

class User {
  //添加用户
  static async insertUser(ctx) {
    let { phone, password } = ctx.request.body;
    const result = userModel.insertMany({
      phone,
      password,
    });
    ctx.body = {
      err: 0,
      msg: "新增用户成功",
      data: result,
    };
  }

  //查询用户
  static async getUser(ctx) {
    const userInfo = await userModel.find({ phone: ctx.request.query.phone });
    ctx.body = {
      err: 0,
      msg: "查找成功",
      data: userInfo,
    };
  }

  //修改密码
  static async changePass(ctx) {
    await userModel
      .where({
        phone: ctx.request.body.phone,
      })
      .updateOne({
        password: ctx.request.body.password,
      });
    const results = await userModel.find({ phone: ctx.request.body.phone });
    ctx.body = {
      err: 0,
      results,
    };
  }
}

module.exports = User;
