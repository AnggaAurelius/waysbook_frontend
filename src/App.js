import React, { useEffect, useContext } from "react";
import "./App.css";
import "./ok.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PrivateRoute } from "./component/route/PrivateRoute";
import { AdminRoute } from "./component/route/AdminRoute";
import { ContextProvider } from "./component/context/modal";
import { AppContext } from "./component/context/Global";
import { API, setAuthToken } from "./config/axios";

import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import Add from "./pages/Admin/AddBook";
import Profile from "./pages/ProfilePage";
import DetailBook from "./pages/DetailBook";
import Cart from "./pages/Cart";
import List from "./pages/Admin/Transaction";
import { Loading } from "./pages/HomePage/fakeLoading";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const [state, dispatch] = useContext(AppContext);
  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      if (response.status === 401) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      dispatch({
        type: "USER_LOADED",
        payload: response.data.data.user,
      });
    } catch (error) {
      console.log(error);
      return dispatch({
        type: "AUTH_ERROR",
      });
    }
  };
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <ContextProvider>
      <Router>
        <div className="App ">
          <Switch>
            <Route path="/" exact component={LandingPage} />
            <PrivateRoute exact path="/beranda" component={HomePage} />
            <PrivateRoute path="/profile" exact component={Profile} />
            <PrivateRoute path="/detail/:id" exact component={DetailBook} />
            <PrivateRoute path="/cart" exact component={Cart} />
            <AdminRoute path="/add" exact component={Add} />
            <AdminRoute path="/list" exact component={List} />
            <PrivateRoute path="/loading/:back" exact component={Loading} />
          </Switch>
        </div>
      </Router>
    </ContextProvider>
  );
};

export default App;
