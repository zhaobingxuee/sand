import React, { useState, useRef, useEffect } from "react";
import PhoneInput from "../../components/phoneInput/PhoneInput";
import Code from "../../components/code/Code";
import PasswordInput from "../../components/passwordInput/PasswordInput";
import PopUp from "../../components/popUp/PopUp";
import axios from "axios";
const ForgotPassword = () => {
  let [phone, setPhone] = useState<string>();
  let [password, setPassword] = useState<string>("");

  function getPhone(phone: string): void {
    setPhone(phone);
  }
  function getPassword(password: string): void {
    setPassword(password);
  }

  const getCode = (code: string): void => {
    console.log("code" + code);
  };
  const modify = () => {
    let popUp: any;
    //检查手机号和验证码对不对
    let phoneRes = null;
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
      setTimeout(() => {
        popUp.onClose();
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
      setTimeout(() => {
        popUp.onClose();
      }, 1500);
      return false
    }

    //修改密码
    // axios.post('http:/')
  };
  return (
    <div>
      <div className="inputs">
        <PhoneInput getPhone={setPhone}></PhoneInput>
        <PasswordInput
          getPassword={getPassword}
          hasForgot={false}
          placeholderText={"修改密码，最少八位"}
        ></PasswordInput>
        <Code getCode={getCode} phoneNumber={phone}></Code>
        <button
          className="button registerBtn"
          onClick={() => {
            modify();
          }}
        >
          {" "}
          修改并登录{" "}
        </button>
      </div>
    </div>
  );
};
export default ForgotPassword;
