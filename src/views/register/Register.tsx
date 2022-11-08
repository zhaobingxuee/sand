import React, { useState, useRef, useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch,
} from "react-router-dom";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import PhoneInput from "../../components/phoneInput/PhoneInput";
import Code from "../../components/code/Code";
import PopUp from "../../components/popUp/PopUp";
import "./register.scss";
import axios from "axios";

function Register() {
  let [phone, setPhone] = useState<string>();
  let [password, setPassword] = useState<string>("");
  let [code, setCode] = useState<string>("");
  //订阅事件
  useEffect(() => {
    PubSub.subscribe("localPhoneValue", (msg, data) => {
      setPhone(data);
    });
    return () => {
      PubSub.unsubscribe("localPhoneValue");
    };
  }, []);

  function getPhone(phone: string): void {
    setPhone(phone);
  }
  function getPassword(password: string): void {
    setPassword(password);
  }

  const getCode = (code: string): void => {
    setCode(code);
  };
  const register = () => {
    let popUp: any;
    //检查手机号和验证码对不对
    let phoneRes: boolean;
    if (phone === undefined || phone.length === 0) {
      //手机号没有填写
      popUp = PopUp({ props: { text: "请输入手机号" } });
      phoneRes = false;
    } else if (!/^[1][0-9]{10}$/.test(phone as string)) {
      //手机号不合规
      popUp = PopUp({ props: { text: "请检查手机号" } });
      phoneRes = false;
    } else {
      phoneRes = true;
    }
    if (!phoneRes) {
      //手机号不合规
      popUp.onOpen();
      let timer = setTimeout(() => {
        popUp.onClose();
        clearTimeout(timer);
      }, 1500);
      return false;
    }

    //检查验证码
    let codeRes: boolean;
    new Promise((resolve, reject) => {
      if (!code) {
        popUp = PopUp({ props: { text: "请输入验证码" } });
        codeRes = false;
        resolve(codeRes);
      } else {
        axios
          .get("http://localhost:8080/checkCode", {
            params: {
              phone: `+86${phone}`,
            },
          })
          .then((data) => {
            let res = data.data.data;
            if (res.length === 1) {
              //判断验证码是否正确
              if (code !== res[0].code) {
                codeRes = false;
                popUp = PopUp({ props: { text: "验证码错误！" } });
                codeRes = false;
              } else if (new Date().getDate() - res[0].sendTime > 5*60*1000) {
                popUp = PopUp({ props: { text: "请重新获取验证码" } });
                codeRes = false;
              } else {
                codeRes = true;
              }
            } else if (res.length === 0) {
              popUp = PopUp({ props: { text: "请获取验证码！" } });
              codeRes = false;
            } else {
              alert("发送验证码插入或者更新数据库有问题");
            }
            resolve(codeRes);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      }
    }).then((data) => {
      //此处data就是codeRes
      if (!data) {
        popUp.onOpen();
        let timer = setTimeout(() => {
          popUp.onClose();
          clearTimeout(timer);
        }, 1500);
        return false;
      }

      let passwordRes = null;
      //检查密码长度 8--18
      if (password == "") {
        popUp = PopUp({ props: { text: "请设置密码" } });
        passwordRes = false;
      } else if (password.length < 8) {
        popUp = PopUp({ props: { text: "密码不能少于8位" } });
        passwordRes = false;
      } else {
        passwordRes = true;
      }
      if (!passwordRes) {
        popUp.onOpen();
        let timer = setTimeout(() => {
          popUp.onClose();
          clearTimeout(timer);
        }, 1500);
        return false;
      }

      //检查所有的是否正确 都正确才可以注册登录
      if (phoneRes && codeRes && passwordRes) {
        //检查是否有这个用户
        axios.get("http://localhost:8080/getUser", {
          params: {
            phone,
          },
        })
        .then((data) => {
          let res = data.data.data;
          if (res.length >= 1) {
            popUp = PopUp({ props: { text: "该手机号已注册" } });
            popUp.onOpen();
            let timer = setTimeout(() => {
              popUp.onClose();
              clearTimeout(timer);
            }, 1500);
            return false;
          } else {
            //注册这个用户
            axios({
              url:'http://localhost:8080/insertUser',
              method:'post',
              data:{
                phone,
                password
              }
            }).then(data=>{
              if(data.data.err === 0){
                console.log('新增用户成功 前往主页')
                window.location.href = '/#/index'
              }
            }).catch(err=>{
              console.log(err)
            })
          }
        })
        .catch((err) => {
          console.log(err);
        });
      }
    });
    
  };
  return (
    <div>
      <div className="inputs">
        <PhoneInput getPhone={setPhone}></PhoneInput>
        <Code getCode={getCode} phoneNumber={phone}></Code>
        <PasswordInput
          getPassword={getPassword}
          hasForgot={false}
          placeholderText={"密码，最少八位"}
        ></PasswordInput>
        <button
          className="button registerBtn"
          onClick={() => {
            register();
          }}
        >
          {" "}
          注册并登录{" "}
        </button>
      </div>
    </div>
  );
}
export default Register;
