import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../../../component/context/modal";
import { AppContext } from "../../../component/context/Global";
import { Form } from "react-bootstrap";
import { API, setAuthToken } from "../../../config/axios";

const Login = () => {
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
  const [state2, dispatch2] = useContext(Context);
  const setModal = state2.modalSignIn;

  const switching = () => {
    if (!setModal) {
      dispatch2({
        type: "SIGN_IN",
      });
    } else {
      dispatch2({
        type: "SIGN_UP",
      });
    }
  };

  // Login
  //
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = loginFormData;

  const handleLogin = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = JSON.stringify({
        email,
        password,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const user = await API.post("/login", body, config);
      const result = user.data.data.user;
      if (result.role === "ADMIN") {
        dispatch({
          type: "ADMIN",
          payload: result,
        });
        history.push("/add");
      } else {
        dispatch({
          type: "LOGIN_SUKSES",
          payload: result,
        });
        history.push("/beranda");
      }
      setAuthToken(result.token);
      dispatch2({
        type: "CLOSE",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <button className="tombol sign signIn" onClick={() => switching()}>
        Login
      </button>
      <div className={` pl-5 pr-5 p-4 Modal ${setModal ? "Show" : ""}`}>
        <p className="timesNew text-left pt-3 fs-35">Login</p>
        <br />
        <Form onSubmit={(e) => onSubmit(e)}>
          <Form.Group controlId="formBasicEmail" className="form">
            <Form.Control
              className="form"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => handleLogin(e)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="form">
            <Form.Control
              className="form"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => handleLogin(e)}
              required
            />
          </Form.Group>
          <br />
          <button className="tombol w00 blackBtn bold w-18" type="submit">
            Login
          </button>
          <div>
            <br />
            <p className="text-center">
              Don't have an account ?{" "}
              <a className="text-dark" href="/#" onClick={() => switching()}>
                <strong> Klik Here</strong>
              </a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Login;
