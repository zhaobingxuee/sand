import React,{useState,PropsWithChildren, useEffect,useRef} from 'react'
import './code.scss'
import PopUp from '../popUp/PopUp'
import PubSub from "pubsub-js"
import axios from 'axios'

interface CodeProps{
  getCode:  Function,
  phoneNumber: string | undefined
}

const Code: React.FC<CodeProps>= (props: PropsWithChildren<CodeProps>) => {

  let [code,setCode] = useState<string>('')
  let [text,setText] = useState<string>('获取验证码')
  let [canClick,setCanClick] = useState<boolean>(true)
  let [checkFunc,setCheckFunc] = useState<Function>()
  let secRef = useRef(5*60000)

  useEffect(() => {
    let now = new Date().getTime()
    if(now - Number(getTime()) < 5*60000){
      //发布事件
      PubSub.publish('localPhoneValue',localStorage.getItem('phoneNumber'))
      //此时页面处于倒计时
      controlTime()
    }else{
      localStorage.removeItem('phoneNumber')
    }
  },[])

  useEffect(() => {
    return () => {
      localStorage.setItem('codeTime', String(secRef.current));
    }
  }, [secRef.current])


  const changeValue = (e:React.ChangeEvent<HTMLInputElement>) => {
    props.getCode(e.target.value)
    setCode(e.target.value)
  }
  //获取本地储存的倒计时
  const getTime = ():String|null => {
    return localStorage.getItem('codeTime')
  }
  //控制页面倒计时
  const controlTime = ():void => {
    setCanClick(false)
    let timer = setInterval(() => {
      let now = new Date().getTime()
      let delTime = 300 - Math.floor((now - Number(getTime()))/1000)
      setText(`再次发送(${delTime})`)
      if(delTime <= 0){
        clearInterval(timer)
        setCanClick(true)
        setText('获取验证码')
      }
    },1000)
  }

  

  const sandCodeFunc = ():void => {
    //判断是倒计时还是可以发送
    if(new Date().getTime() - Number(getTime()) >= 5*60000){
      //当前可以发送验证码
      //判断手机号码对不对
      let phoneRes = null
      let popUp:any
      if(props.phoneNumber == undefined){
        //手机号没有填写
        popUp = PopUp({props:{text:'请输入手机号'}})
        phoneRes = false
      }else if(!/^[1][0-9]{10}$/.test(props.phoneNumber as string)){
        //手机号不合规
        popUp = PopUp({props:{text:'请检查手机号'}})
        phoneRes = false
      }else{
        phoneRes = true
      }
      if(phoneRes){
        axios.get('http://localhost:8080/sendCode',{
          params:{
            phone:props.phoneNumber
          }
        })
        .then(data=>{
          console.log(data)
          if(data.data.err === 0){
            localStorage.setItem('phoneNumber', props.phoneNumber as string)
            secRef.current = new Date().getTime()
            controlTime()
          }
        }).catch(err=>{
          console.log(err)
        })

      }else{
        //手机号不合规
        popUp.onOpen()
        setTimeout(() => {
          popUp.onClose()
        }, 1500);
      }
    }else{
      console.log('不发验证码 还在倒计时')
    }
  }
  return (
    <div className="group codeOuter">
      <input 
        placeholder="验证码"
        type="search" 
        className="input"
        value={code}
        onChange={changeValue}
      />
      <button style={{color:canClick ? 'lightcoral' : '#8d8c8c'}} onClick={sandCodeFunc}>
        {text}
      </button>
    </div>
  )
}
export default Code
