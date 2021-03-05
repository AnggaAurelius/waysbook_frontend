import React, { useContext, useEffect, useState } from "react";
import "./style.css";
import { Context } from "../../component/context/modal";
import book from "./img/waysBooks.png";
import Login from "./login";
import Register from "./register";
import { AppContext } from "../../component/context/Global";
import { useHistory } from "react-router-dom";
import { ShowBooks } from "./ShowBooks";
import bgw from "./img/bgw.jpg";

const LandingPage = () => {
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
  const [state2, dispatch2] = useContext(Context);
  const setSignup = state2.modalSignUp;
  const setSignin = state2.modalSignIn;

  const setOverlay = () => {
    dispatch2({
      type: "CLOSE",
    });
  };
  const switching = () => {
    dispatch2({
      type: "SIGN_IN",
    });
  };

  useEffect(() => {
    if (!state.loading && state.user.role === "ADMIN") {
      dispatch({
        type: "ADMIN_LOADED",
        payload: state.user,
      });
      history.push("/add");
    } else if (!state.loading && state.isLogin) {
      history.push("/beranda");
    }
  }, [state]);
  return (
    <div className="pt-2 bgImage" style={{ backgroundImage: `url( ${bgw})` }}>
      <img src={book} alt="" className="logoBook" />
      <Login />
      <br />
      <Register />
      <div onClick={() => switching()}>
        <ShowBooks />
      </div>

      <div
        className={`Overlay ${setSignup || setSignin ? "Show" : ""}`}
        onClick={() => setOverlay()}
      />
      <div className="botland" />
    </div>
  );
};

export default LandingPage;
