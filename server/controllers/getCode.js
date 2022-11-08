const CodeModel = require("../models/getCode");
const tencentcloud = require("tencentcloud-sdk-nodejs");
const { param } = require("../router");
const SmsClient = tencentcloud.sms.v20210111.Client;

class GetCode {
  //发送验证码
  static async sendCode(ctx) {
    let phone = `+86${ctx.request.query.phone}`;
    // 随机生成验证码
    const code = String(Math.round(Math.random() * 899999 + 100000));
    const clientConfig = {
      credential: {
        secretId: "AKIDNhpkeRzKRJwKTN3Zx9B3hAaoqeHhwwkT",
        secretKey: "c2CAxZx8EAtNisshKl8KHCzYsxmMiphK",
      },
      region: "ap-nanjing",
      profile: {
        httpProfile: {
          endpoint: "sms.tencentcloudapi.com",
        },
      },
    };
    const client = new SmsClient(clientConfig);
    const params = {
      PhoneNumberSet: [phone],
      SmsSdkAppId: "1400731847",
      TemplateId: "1531342",
      SignName: "sand沙砾个人公众号",
      TemplateParamSet: [code,'5'],
    };
    let result = null

    //腾讯云发送验证码
    function sendMess(params){
      return new Promise((resolve,reject)=>{
        client.SendSms(params).then(
          (data) => {
            resolve(data)
          },
          (err) => {
            // console.error("error", err);
            reject(err)
          }
        )
      })
    }


    //判断数据库里面有没有这个手机号
    async function checkPhone(){
      let codeItem = await CodeModel.find({phone:phone})
      return new Promise((resolve,reject)=>{
        resolve(codeItem)
      })
    }

    let sendData = await sendMess(params)//根据腾讯云发送短信后返回的数据 在数据库里操作手机号验证码
    if (sendData.SendStatusSet[0].Code == 'Ok') {
      //发送成功之后 要在数据库里面找这个手机号 如果有就更新他的验证码和发送时间
      let codeHostItem = await checkPhone()
      if(codeHostItem.length){
        //更新该手机号对应的验证码
        await CodeModel.where({
          phone:phone
        }).updateOne({
          code:code,
          sendTime: new Date().getTime(),
        })
        result = {
          err: 0,
          msg: "发送成功",
          data: sendData.SendStatusSet[0].Message,
        }
        console.log('更新数据库')
      }else{
        //把这个手机号和相关数据插入数据库
        await CodeModel.insertMany({
          phone,
          code,
          sendTime: new Date().getTime(),
        });
        result = {
          err: 0,
          msg: "发送成功",
          data: sendData.SendStatusSet[0].Message,
        }
        console.log('插入数据库')
      }
    }else{
      result = {
        err: 1,
        msg: "发送失败",
        data: sendData.SendStatusSet[0].Message,
      }
    }
    ctx.body = result
  }

  //检查验证码是否正确
  static async checkCode(ctx){
    const codeInfo = await CodeModel.find({phone:ctx.request.query.phone})
    ctx.body = {
      err:0,
      msg:'查找成功',
      data: codeInfo
    }
  }
}

module.exports = GetCode;
