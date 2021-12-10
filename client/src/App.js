import './App.css'
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import LandingPage from '../src/components/views/LandingPage/LandingPage'
import LoginPage from '../src/components/views/LoginPage/LoginPage'
import RegisterPage from '../src/components/views/RegisterPage/RegisterPage'
import Auth from '../src/hoc/auth'

function App() {
  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path='/' component={Auth(LandingPage, null)} />
        <Route exact path='/login' component={Auth(LoginPage, false)} />
        <Route exact path='/register' component={Auth(RegisterPage, false)} />
      </Switch>
    </Router>
  )
}

export default App
