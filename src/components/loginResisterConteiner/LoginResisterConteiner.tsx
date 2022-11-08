import React,{useState,PropsWithChildren, ReactElement} from 'react'
import {HashRouter as Router,Route,NavLink,Redirect,Switch} from 'react-router-dom'
import Login from '../../views/login/login'
import Register from '../../views/register/Register'
import ForgotPassword from '../../views/forgotPassword/ForgotPassword'
import Circle from '../circle/Circle'
import circle1 from '../../../public/img/circleA.png'
import bcg from '../../../public/img/loginBcg.png'
import './LoginResisterConteiner.scss'

const LoginResisterConteiner = () => {
  return (
    <div className='container'>
      <div className='bcg' style={{backgroundImage:`url(${bcg})`,backgroundRepeat:'no-repeat',backgroundSize: 'cover'}}>
        {/* <div className='upper'></div> */}
        {/* <Circle></Circle> */}
        <img src={circle1}/>
        <div className='mainOuter'>
          <Switch>
            <Route exact path="/home/login" component={Login}></Route>
            <Route exact path="/home/register" component={Register}></Route>
            <Route exact path="/home/forgotPassword" component={ForgotPassword}></Route>
            <Redirect exact from='/home' to="/home/login"/>
          </Switch>
        </div>
      </div>
    </div>
  )
}
export default LoginResisterConteiner