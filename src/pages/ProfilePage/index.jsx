import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../component/context/Global";
import email from "./image/email.png";
import kel from "./image/gender.png";
import call from "./image/call.png";
import map from "./image/map.png";
import { useHistory } from "react-router-dom";
import Navbar from "../../component/Navbar";
import { Button, Modal, Form } from "react-bootstrap";
import { API } from "../../config/axios";
import bgw from "../bgw.jpg";
import { createBrowserHistory } from "history";

const Profile = () => {
  const history = useHistory();
  const history2 = createBrowserHistory();
  const path = history2.location.pathname;
  const [state] = useContext(AppContext);
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState("");
  const handleClose = () => {
    setShow(false);
    setFile("");
  };
  const [profile, setProfile] = useState([]);
  const getUser = async () => {
    try {
      // setLoading(true);
      const user = await API.get("/user");
      // setLoading(false);
      setProfile(user.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const [form, setForm] = useState({
    gender: "",
    phone: "",
    address: "",
  });
  const handleShow = () => {
    setModal("Edit Profile");
    setShow(true);
    setForm({
      gender: profile.gender,
      phone: profile.phone,
      address: profile.address,
    });
  };
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { gender, phone, address } = form;
  const submit = async (e) => {
    e.preventDefault();

    try {
      const body = JSON.stringify({
        gender,
        phone,
        address,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await API.patch("/editUser", body, config);
      getUser();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  let qty = 0;
  const [cart, setCart] = useState([]);
  const getCart = async () => {
    try {
      const carts = await API.get("/Cart");
      setCart(carts.data.data.carts);
    } catch (error) {
      console.log(error);
    }
  };
  const [myBook, setMyBook] = useState([]);
  const getMyBook = async () => {
    try {
      const findBook = await API.get("/getMyBook");
      setMyBook(findBook.data.data.book);
    } catch (error) {
      console.log(error);
    }
  };
  const imgProfile = () => {
    setModal("Profile Picture");
    setShow(true);
  };
  const [form2, setForm2] = useState({
    imageFile: null,
  });
  const [filee, setFile] = useState();

  const onChange2 = (e) => {
    const updateForm = { ...form2 };
    updateForm[e.target.name] =
      e.target.type === "file" ? e.target.files[0] : e.target.value;

    setForm2(updateForm);
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  const { imageFile } = form2;

  const submitImage = async (e) => {
    e.preventDefault();

    try {
      const body = new FormData();

      body.append("imageFile", imageFile);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      await API.patch("/editPic", body, config);
      history.push(`/loading${path}`);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
    getCart();
    getMyBook();
  }, []);

  return (
    <div className=" bgImage" style={{ backgroundImage: `url( ${bgw})` }}>
      <div className="">
        <Navbar />
      </div>
      <div className="profileBody text-left mt-5">
        <div className="col">
          <h1 className="mt-5 mb-5 timesNew">Profile</h1>
          <div className="pp">
            <div className="mt-5 ml-5">
              <br />
              <br />
              <div className=" float-right pr-5">
                <img
                  src={profile.avatar}
                  alt=""
                  onClick={imgProfile}
                  className="pointer profilPic"
                />
                <br />
                <br />
                <button
                  className="w00 tombol blackBtn white "
                  onClick={handleShow}
                  type=""
                >
                  Edit profil
                </button>
              </div>
              <div>
                <img className=" float-left pt-3" src={email} alt="" />
                <div className="ml-5 ">
                  <h5 className="font-weight-bold">{profile.email}</h5>
                  <p>email</p>
                </div>
              </div>
              <div className="pt-3">
                <img className=" float-left pt-3" src={kel} alt="" />
                <div className="ml-5">
                  <h5 className="font-weight-bold">{profile.gender}</h5>
                  <p>Gender</p>
                </div>
              </div>
              <div className="pt-3">
                <img className=" float-left pt-3" src={call} alt="" />
                <div className="ml-5">
                  <h5 className="font-weight-bold">{profile.phone}</h5>
                  <p>Mobile Phone</p>
                </div>
              </div>
              <div className="pt-3 pb-5">
                <img className=" float-left pt-3" src={map} alt="" />
                <div className="ml-5">
                  <h5 className="font-weight-bold">{profile.address}</h5>
                  <p>Address</p>
                </div>
              </div>
            </div>
          </div>
          <h2 className="timesNew myBooks">My Books</h2>
          <div className="row">
            {myBook.map((mybook) => (
              <div className=" mr-4 ml-3 mb-5" key={mybook.id}>
                <a
                  href={`http://localhost:5000/uploads/${mybook.book.bookAttachment}`}
                  className="bold"
                  target="_blank"
                >
                  <img
                    className="lbook flink text-center"
                    src={`http://localhost:5000/uploads/${mybook.book.thumbnail}`}
                    alt=""
                  />
                </a>
                <h3
                  className="mt-3 timesNew text-truncate"
                  style={{ width: 212 }}
                >
                  {mybook.book.title}
                </h3>
                <p className="gray authorPr">{mybook.book.author}</p>
                <a
                  href={`http://localhost:5000/uploads/${mybook.book.bookAttachment}`}
                  className="bold"
                  target="_blank"
                >
                  <button className="tombol blackBtn btnDwld bold fs-18 mt-4">
                    Download
                  </button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      {cart.map((Cart) => (
        <div className="row mb-5" key={Cart.id} hidden>
          <p>{qty++}</p>
        </div>
      ))}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modal}</Modal.Title>
        </Modal.Header>
        {modal === "Edit Profile" ? (
          <Form onSubmit={(e) => submit(e)}>
            <Modal.Body>
              <Form.Label>Gender</Form.Label>
              <Form.Group controlId="" className="">
                <Form.Control
                  className=""
                  type="text"
                  placeholder={profile.gender}
                  name="gender"
                  value={gender}
                  onChange={(e) => onChange(e)}
                  required
                />
              </Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Group controlId="" className="">
                <Form.Control
                  className=""
                  type="text"
                  placeholder={profile.phone}
                  name="phone"
                  value={phone}
                  onChange={(e) => onChange(e)}
                  required
                />
              </Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Group controlId="" className="">
                <Form.Control
                  className=""
                  type="text"
                  placeholder={profile.address}
                  name="address"
                  value={address}
                  onChange={(e) => onChange(e)}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Modal.Footer>
          </Form>
        ) : (
          <Form onSubmit={(e) => submitImage(e)}>
            <Modal.Body>
              <Form.Group>
                <Form.File
                  className="position-relative"
                  required
                  name="imageFile"
                  onChange={(e) => onChange2(e)}
                  feedbackTooltip
                />
              </Form.Group>
              <img src={filee} alt="" className="preview2 mb-2" />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
      <div />
      <div className={`cartNo ${qty == 0 || !state.isLogin ? "hide" : ""}`}>
        <p>{qty}</p>
      </div>
    </div>
  );
};

export default Profile;
