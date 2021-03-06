import React, { useContext, useState, useEffect } from "react";
import "./dropStyles.css";
import "../ok.css";
import book from "../pages/LandingPage/img/waysBooks.png";
import ic_profile from "./img/ic_profile.png";
import add from "./img/addBook.png";
import logOut from "./img/logoutRed.png";
import cart from "./img/cart.png";
import list from "./img/list.png";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { AppContext } from "./context/Global";
import { API } from "../config/axios";

const Navbar = () => {
  const [state, dispatch] = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const setOverlay = () => setIsActive(false);
  const onClick = () => setIsActive(!isActive);
  const handleLogOut = () => {
    dispatch({
      type: "LOGOUT",
    });
  };
  const [profile, setProfile] = useState([]);
  const getUser = async () => {
    try {
      setLoading(true);
      const user = await API.get("/user");
      setLoading(false);
      setProfile(user.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  const role = state.user.role;
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="nv">
      <Link to="/beranda" as={Link}>
        <img className=" logoBook" src={book} alt="" />
      </Link>
      <div className="navProf">
        <div className="menu-container">
          <Link to="/cart" as={Link}>
            <img
              className={role === "ADMIN" ? "hide" : "cart"}
              src={cart}
              alt=""
            />
          </Link>
          <button onClick={onClick} className="menu-trigger">
            <img
              className={`navPic right ${loading ? "" : ""}  `}
              src={profile.avatar}
              alt=""
            />
          </button>
          <nav className={`menu ${isActive ? "active" : ""}`}>
            <ul>
              <li className={role === "ADMIN" ? "hide" : ""}>
                <Link to="/profile" as={Link} className="bold">
                  <img className="mr-3" src={ic_profile} alt="" width="35px" />
                  Profile
                </Link>
              </li>
              <li className={role === "USER" ? "hide" : ""}>
                <Link to="/add" as={Link} className="bold">
                  <img className="mr-3" src={add} alt="" width="35px" />
                  Add Book
                </Link>
              </li>
              <li className={role === "USER" ? "hide" : ""}>
                <Link to="/list" as={Link} className="bold">
                  <img className="mr-3" src={list} alt="" width="35px" />
                  Transaction
                </Link>
              </li>
              <li>
                <Link to="/" as={Link} onClick={handleLogOut} className="bold">
                  <img className="mr-3" src={logOut} alt="" width="35px" />
                  Log Out
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div
        className={`Overlay2 ${isActive ? "Show" : ""}`}
        onClick={() => setOverlay()}
      />
    </div>
  );
};

export default Navbar;
