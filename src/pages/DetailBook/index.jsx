import React, { useState, useEffect } from "react";
import cart2 from "./wCart.png";
import { useParams } from "react-router-dom";
import { API } from "../../config/axios";
import Navbar from "../../component/Navbar";
import { Modal } from "react-bootstrap";
import bgw from "../bgw.jpg";

export const Detailbook = () => {
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [text, setText] = useState(
    "The product is successfully added to the cart"
  );
  const handleClose = () => setShow(false);
  const { id } = useParams();
  const [book, setBook] = useState([]);
  const getBook = async () => {
    try {
      setLoading(true);
      const findBook = await API.get(`/book/${id}`);
      setBook(findBook.data.data.book);
      checkBook();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const [cek, sett] = useState([]);
  const checkBook = async () => {
    try {
      const findBook = await API.get(`/checkBook/${id}`);
      sett(findBook.data.data.book);
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

  const addCart = async () => {
    try {
      const body = JSON.stringify({
        bookId: id,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const check = await API.post("/addCart", body, config);
      if (check.data.status === "wait") {
        setText("Please wait 1 x 24 hours to verify your order");
        setShow(true);
      } else if (check.data.status === "error") {
        setText("Book already added to cart");
        setShow(true);
      } else {
        getCart();
        setShow(true);
        const item = await API.get("/getsum");

        if (item.data.status === "error") {
          const create = JSON.stringify({
            qty: 1,
            pay: book.price,
          });
          await API.post("/addsum", create, config);
        } else if (item.data.status === "success") {
          const data = item.data.data.sum;
          const edit = JSON.stringify({
            qty: data.qty + 1,
            pay: data.pay + book.price,
          });
          await API.patch("/editsum", edit, config);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBook();
    window.scrollTo(0, 0);
    getCart();
  }, []);
  return loading ? (
    <h1>loading</h1>
  ) : (
    <div className="bgImage" style={{ backgroundImage: `url( ${bgw})` }}>
      <Navbar />
      <div className="mp-10 pt-60 text-left ml-270 mb-5">
        <img
          className="cover  float-left mr-5"
          src={`http://localhost:5000/uploads/${book.thumbnail}`}
          alt=""
        />
        <p className="mt-5 pt-5 timesNew fs-50 titleDetail">{book.title}</p>
        <h1 className="gray fs-25">{book.author}</h1>
        <div className="mt-5">
          <h3 className="bold">Publication date </h3>
          <p className="gray">{book.publicationDate}</p>
          <h3 className="mt-4 bold">Pages</h3>
          <p className="gray">{book.pages}</p>
          <h3 className="mt-4 red bold">ISBN</h3>
          <p className="gray">{book.isbn}</p>
          <h3 className="mt-4 bold">Price</h3>
          <p className="price">{book.price}</p>
        </div>
        <br />
        <h2 className="detxt timesNew mb-4">About this book </h2>
        <p className="gray text-justify pb-5">{book.description}</p>
        <br />
        <button
          className="blackBtn detailCart float-right "
          onClick={() => addCart()}
        >
          Add Cart <img className="imgMini ml-3 mb-1" src={cart2} alt="" />
        </button>
        {cek.map((Cek) => (
          <div className="" key={Cek.id}>
            <a
              href={`http://localhost:5000/uploads/${Cek.book.bookAttachment}`}
              className=""
              target="_blank"
            >
              <button className="blackBtn  bold detaildwn float-right ">
                Download
              </button>
            </a>
          </div>
        ))}
        <br />
      </div>
      {cart.map((Cart) => (
        <div className="row mb-5" key={Cart.id} hidden>
          <p>{qty++}</p>
        </div>
      ))}
      <div className={`cartNo ${qty == 0 ? "hide" : ""}`}>
        <p>{qty}</p>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        className="pt-5 mt-5 fs-20 green avenir"
      >
        <Modal.Body className="center">{text}</Modal.Body>
      </Modal>
    </div>
  );
};

export default Detailbook;
