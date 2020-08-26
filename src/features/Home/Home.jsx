import React, { useState } from "react";
import { Route, Link, Switch, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetHaveData, addRoute } from "./MyCollection/SingleItem/singleItemSlice";
import { logUserOut } from "../Authentication/authSlice";
import MyCollection from "./MyCollection/MyCollection";
import Orders from "./Orders/Orders";
import Account from "./Account/Account";
import Help from "./Help/Help";
import Button from "../Button/Button";
import catesbyLogo from "../../images/catesby-logo.svg";
import "../../css/Home.css";

const Home = () => {
  const dispatch = useDispatch(); // react-redux method

  // state to handle click on navigation buttons at bottom of app
  // preset to 1 as the app is always redirected to MyCollection on load
  const [linkClicked, setLinkClicked] = useState(1);

  const handleLinkClicked = num => {
    // Four numbers to dynamically add box over link after click
    // 1:MyCollection 2:Orders 3:Acount 4:Help
    setLinkClicked(num);
    dispatch(resetHaveData());
    dispatch(addRoute(false))
  };

  return (
    <div className="home-container">
      <nav>
        <div className="logo-container">
          <img src={catesbyLogo} alt="catesby-logo" className="logo" />
        </div>
        <div className="logout-btn">
          <Button btnMessage={"Logout"} onClick={() => dispatch(logUserOut())} />
        </div>
      </nav>
      <Switch>
        <Route exact path="/"> 
          <Redirect to="/My-Collection" />
        </Route>
        <Route exact path="/:a(login|signup)">
          <Redirect to="/My-Collection" />
        </Route>
        <Route exact path="/My-Collection" component={MyCollection} />
        <Route exact path="/Orders" component={Orders} />
        <Route exact path="/Account" component={Account} />
        <Route exact path="/Help" component={Help} />
      </Switch>
      <footer>
        <ul>
          <li onClick={() => handleLinkClicked(1)}>
            <Link to="/My-Collection" className="route-link">
              <div
                className={
                  linkClicked === 1
                    ? "route-link-wrapper route-link-wrapper-clicked my-collection"
                    : "route-link-wrapper"
                }
              ></div>
              My Collection
            </Link>
          </li>
          <li onClick={() => handleLinkClicked(2)}>
            <Link to="/Orders" className="route-link">
              <div
                className={
                  linkClicked === 2
                    ? "route-link-wrapper route-link-wrapper-clicked"
                    : "route-link-wrapper"
                }
              ></div>
              Orders
            </Link>
          </li>
          <li onClick={() => handleLinkClicked(3)}>
            <Link to="/Account" className="route-link">
              <div
                className={
                  linkClicked === 3
                    ? "route-link-wrapper route-link-wrapper-clicked"
                    : "route-link-wrapper"
                }
              ></div>
              Account
            </Link>
          </li>
          <li onClick={() => handleLinkClicked(4)}>
            <Link to="/Help" className="route-link">
              <div
                className={
                  linkClicked === 4
                    ? "route-link-wrapper route-link-wrapper-clicked"
                    : "route-link-wrapper"
                }
              ></div>
              Help
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Home;