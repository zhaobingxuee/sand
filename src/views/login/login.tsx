import React,{useState,useRef,MouseEvent, useEffect} from 'react'
import {HashRouter as Router,Route,NavLink,Redirect,Switch} from 'react-router-dom'
import PasswordInput from '../../components/passwordInput/PasswordInput'
import PhoneInput from '../../components/phoneInput/PhoneInput'
import PopUp from '../../components/popUp/PopUp'
import debounce from '../../functions/debunce'
import axios from 'axios'
import './login.scss'


export interface PopUpProps{
  text:string
}

function Login(){
  let [phone,setPhone] = useState<string>('')
  let [password,setPassword] = useState<string>('')

  const loginFunc = (phone:string,password:string) => {
    let phoneRes = null
    let popUp:any
    //判断手机号是否正确
    if(phone.length === 0){
			//手机号没有填写
      popUp = PopUp({props:{text:'请输入手机号'}})
			phoneRes = false
		}else if(!/^[1][0-9]{10}$/.test(phone)){
      //手机号不合规
      popUp = PopUp({props:{text:'请检查手机号'}})
			phoneRes = false
		}else{
			phoneRes = true
		}
    if(!phoneRes){
      popUp.onOpen()
      let timer = setTimeout(()=>{
        popUp.onClose()
        clearTimeout(timer)
      },1500)
      return false
    }

    //检查密码是否填写
    let passwordRes = null
    if(password == ''){
      passwordRes = false
      popUp = PopUp({props:{text:'请输入密码'}})
    }else{
      passwordRes = true
    }
    if(!passwordRes){
      popUp.onOpen()
      let timer = setTimeout(()=>{
        popUp.onClose()
        clearTimeout(timer)
      },1500)
    }

    //检查是否有这个用户
    if(phoneRes && passwordRes){
      axios.get('http://localhost:8080/getUser',{
        params:{
          phone
        }
      }).then(data => {
        let dataArr = data.data.data
        let dataArrRes = null
        if(dataArr.length === 0){
          popUp = PopUp({props:{text:'您还未注册，请前往注册！'}})
          dataArrRes = false
        }else if(dataArr[0].password != password){
          popUp = PopUp({props:{text:'密码错误！'}})
          dataArrRes = false
        }else{
          dataArrRes = true
          console.log('登录成功，跳到主页')
          sessionStorage.setItem("phone", phone);
          window.location.href = '/#/index'
        }
        //如果密码有错误或者未注册
        if(!dataArrRes){
          popUp.onOpen()
          let timer = setTimeout(() => {
            popUp.onClose()
            clearTimeout(timer)
          }, 1500);
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }


  function getPassword(password:string):void{
    setPassword(password)
  }

  // let debounced:Function = debounce(loginFunc,phone,password)

  return(
    <div>
      <div className='inputs'>
        <PhoneInput
          getPhone={setPhone}
        ></PhoneInput>
        <PasswordInput getPassword={getPassword} hasForgot={true} placeholderText={'密码'}></PasswordInput>
        {/* <button className="button" onClick={()=>{debounced()}}> 登 录 </button> */}
        <button className="button" onClick={()=>{loginFunc(phone,password)}}> 登 录</button>
      </div>
      <NavLink to="/home/register" className='toregister'>没有账号？点击注册</NavLink>
    </div>
  )
}
export default Login