const roomsModel = require("../models/rooms");
const axios = require("axios");
class User {
  //获取所有标签
  static async getAllRooms(ctx) {
    const roomInfo = await roomsModel.find();
    ctx.body = {
      err: 0,
      msg: "查找成功",
      data: roomInfo,
    };
  }

  //新增标签
  static async addRoom(ctx) {
    let { name } = ctx.request.body;
    /**
     *
     * @param {*} sequenceName: findOneAndUpdate函数的conditions
     * @returns 返回新的sequence_value值，用于重新赋值id
     */

    //获取已经存在的标签的最大id
    async function getNextSequenceValue(sequenceName) {
      let sequenceDocument = await roomsModel.findOneAndUpdate(
        { id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true },
      );
      return sequenceDocument.sequence_value;
    }


    getNextSequenceValue(0).then((data) => {
      console.log("当前的" + data);
      let result = roomsModel.insertMany({name:name,id:data})
      console.log(111)
      return result
    }).then(data=>{
      ctx.body = data[0]
      console.log(data[0])
    }).catch(err=>{
      console.log(err)
    })
    // let result = await roomsModel.insertMany({name:name,id:0})
  }
}

module.exports = User;
