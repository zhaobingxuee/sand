import React,{useState,PropsWithChildren} from 'react'
import {HashRouter as Router,Route,NavLink,Redirect,Switch} from 'react-router-dom'
import './passwordInput.css'

interface PasswordProps {
  getPassword: Function,
  hasForgot: Boolean,
  placeholderText:string
}


const PasswordInput: React.FC<PasswordProps>= (props: PropsWithChildren<PasswordProps>) => {
  function changeValue(e:React.ChangeEvent<HTMLInputElement>):void{
    setPassword(e.target.value)
    props.getPassword(e.target.value)
  }
  
  const [password,setPassword] = useState('')
  
  return (
    <div className="group">
      <div className="group" style={{marginTop:'20px'}}>
        <input
          placeholder={props.placeholderText}
          type="search" 
          className="input"
          value={password}
          onChange={changeValue}
        />
        {
          props.hasForgot && 
          <NavLink to='/home/forgotPassword' className='forgot'>忘记密码？点击找回</NavLink>
        }
      </div>
    </div>
  )
}
export default PasswordInput