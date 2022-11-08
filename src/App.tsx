import React from 'react'
import LoginResisterConteiner from './components/loginResisterConteiner/LoginResisterConteiner'
import IndexPage from './views/indexPage/IndexPage'
import CallPage from './views/callPage/CallPage'
import Login from './views/login/login'
import Register from './views/register/Register'
import {HashRouter as Router,Route,NavLink,Redirect,Switch} from 'react-router-dom'

function App() {
  return(
    <Router>
      <Switch>
        {/*Redirect 是路由转化  即匹配到某一个路由转化到另一个路由  */}
        {/* <Redirect from="/" exact to="/login"/>
        <Route path='/' component={LoginResisterConteiner}>
          <Route path="/login" component={Login} exact></Route>
          <Route path="/register" component={Register}></Route>
        </Route> */}
        <Redirect from="/" exact to="/home"/>
        <Route path="/home" component={LoginResisterConteiner}></Route>
        <Route path="/index" component={IndexPage}></Route>
        <Route path="/callPage" component={CallPage}></Route>
      </Switch>
    </Router>
  )
}
export default App;