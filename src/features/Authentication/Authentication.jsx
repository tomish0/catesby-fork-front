import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import SignUp from "../SignUp/SignUp";
import Login from "../Login/Login";
import catesbyLogoTitle from "../../images/catesby-logo-title.svg";
import "../../css/Authentication.css";

const Auth = () => {
  return (
    <div className="app-auth">
        <img src={catesbyLogoTitle} alt="catesby-logo" className="logo-title" />

        <div className="login-container-hidden">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path=":a(.+)">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </div>
      
    </div>
  );
};

export default Auth;
