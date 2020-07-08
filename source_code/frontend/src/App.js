import React from 'react';
import './App.css';
import SignIn from "./components/auth/SignIn";

import AuthStore from "./components/auth/AuthStore";
import Report from "./components/report/Report"
import Records from './components/record/Records'
import Patient from './components/patient/Patient'
import MetaReport from "./components/metaData/MetaReport"
import { createBrowserHistory } from 'history';
import { Route,Router, Switch, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => AuthStore.isLoggedIn()
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login' }} />} />
    );
}


function App() {
   
  return (
      <div className="App">
            <div className='h-100'>
              <Switch>
                      <Route path="/login" component={SignIn} /> 

                      <PrivateRoute exact path="/report/:id" component={Report} />
                      <PrivateRoute exact path="/meta_report" component={MetaReport} />
                      <PrivateRoute exact path="/records" component={Records} />
                      <PrivateRoute exact path="/" component={Patient} />
                 
              </Switch>
            </div>
    </div>
  );
}

export default App;
