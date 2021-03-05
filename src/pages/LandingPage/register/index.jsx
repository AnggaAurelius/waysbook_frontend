import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../../../component/context/modal";
import { AppContext } from "../../../component/context/Global";
import { Form } from "react-bootstrap";
import { API, setAuthToken } from "../../../config/axios";

const Register = () => {
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
  const [state2, dispatch2] = useContext(Context);
  const setModal = state2.modalSignUp;

  const switching = () => {
    if (!setModal) {
      dispatch2({
        type: "SIGN_UP",
      });
    } else {
      dispatch2({
        type: "SIGN_IN",
      });
    }
  };

  const [formDataRegister, setFormDataRegister] = useState({
    email: "",
    password: "",
    fullname: "",
  });
  const { email, password, fullname } = formDataRegister;
  const handleChangeRegister = (e) => {
    setFormDataRegister({
      ...formDataRegister,
      [e.target.name]: e.target.value,
    });
  };
  const registerSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = JSON.stringify({
        email: email,
        password: password,
        fullName: fullname,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const user = await API.post("/register", body, config);

      dispatch({
        type: "LOGIN_SUKSES",
        payload: user.data.data.user,
      });

      setAuthToken(user.data.data.user.token);
      dispatch2({
        type: "CLOSE",
      });

      history.push("/beranda");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <button
        className="tombol sign signUp blackBtn white"
        onClick={() => switching()}
      >
        Register
      </button>
      <div className={`pl-5 pr-5 Modal ${setModal ? "Show" : ""}`}>
        <h3 className=" pt-5 timesNew text-left fs-35">Register</h3>
        <br />
        <Form onSubmit={(e) => registerSubmit(e)}>
          <Form.Group controlId="formBasicEmail" className=" form">
            <Form.Control
              className="p-3 form"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => handleChangeRegister(e)}
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
              onChange={(e) => handleChangeRegister(e)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formFullName" className=" form">
            <Form.Control
              className="form"
              type="text"
              placeholder="Full Name"
              name="fullname"
              value={fullname}
              onChange={(e) => handleChangeRegister(e)}
              required
            />
          </Form.Group>
          <br />
          <div className="">
            <button className="tombol w00 blackBtn bold w-18" type="submit">
              Register
            </button>
            <p className="mt-4 text-center">
              Already have an account ?{" "}
              <a
                className="text-dark"
                href="/#"
                onClick={() => switching(true)}
              >
                <strong> Klik Here</strong>
              </a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Register;
