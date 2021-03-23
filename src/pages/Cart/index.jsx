import React, { useEffect, useState } from "react";
import attach from "./img/AttacheTransaction.png";
import empty from "./img/cart.png";
import trash from "./img/trash.png";
import { API } from "../../config/axios";
import Navbar from "../../component/Navbar";
import { Modal } from "react-bootstrap";
import bgw from "../bgw.jpg";
import Loader from "react-loader-spinner";

export const Cart = () => {
  const [zero, setZero] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  let qty = 0;
  const [cart, setCart] = useState([]);

  const getCart = async () => {
    try {
      setLoading(true);
      const carts = await API.get("/Cart");
      setCart(carts.data.data.carts);
      getSum();
    } catch (error) {
      console.log(error);
    }
  };

  const [data, setData] = useState([]);
  const getSum = async () => {
    try {
      const item = await API.get("/getsum");
      setData(item.data.data.sum);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const delCart = async (id, price) => {
    try {
      await API.delete(`/deleteCart/${id}`);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const edit = JSON.stringify({
        qty: data.qty - 1,
        pay: data.pay - price,
      });

      await API.patch("/editsum", edit, config);
      getCart();
    } catch (error) {
      console.log(error);
    }
  };

  //upload image
  const [form, setForm] = useState({
    thumbnail: null,
  });
  const [filee, setFile] = useState();

  const onChange = (e) => {
    const updateForm = { ...form };
    updateForm[e.target.name] =
      e.target.type === "file" ? e.target.files[0] : e.target.value;

    setForm(updateForm);
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  const { thumbnail } = form;

  const submitImage = async (e) => {
    e.preventDefault();

    try {
      const body = new FormData();

      body.append("thumbnail", thumbnail);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      await API.post("/add-transaction", body, config);
      setShow(true);
      setZero(true);
      setForm({
        thumbnail: null,
      });
      setFile("");
      await API.delete("/deleteAll");
      await API.delete("/clear");
      window.scrollTo(0, 0);
      getCart();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCart();
  }, []);

  return loading ? (
    <div className=" full bgImage pt-5 " style={{ backgroundImage: `url( ${bgw})` }}>
     <Loader
        type="Puff"
        color="#00BFFF"
        height={500}
        width={500}
        timeout={3000} //3 secs
      />
    </div>
  ) : (
    <div className="bgImage" style={{ backgroundImage: `url( ${bgw})` }}>
      <Navbar />
      <div className="mCart text-left ">
        <p className="timesNew fs-25 mb-4 pt-3">My Cart</p>
        <div className="row">
          <div className="order fs-18  col-xl-6">
            Review Your Order
            <hr className="line2 mr-5" />
            {cart.map((Cart) => (
              <div className="row mb-5" key={Cart.id}>
                <p hidden>{qty++}</p>
                <img src={Cart.book.thumbnail} alt="" className="imgOrder " />
                <div className=" ml-1 detailOr">
                  <p className="timesNew fs-25">{Cart.book.title}</p>
                  <p className=" gray authorOr">{Cart.book.author}</p>
                  <p className="priceOr">Rp. {Cart.book.price}</p>
                </div>
                <img
                  src={trash}
                  alt=""
                  className="trash pointer"
                  onClick={() => delCart(Cart.id, Cart.book.price)}
                />
              </div>
            ))}
            {qty == 0 ? (
              <div className="center">
                <img src={empty} alt="" />
                <h2>Unfortunately, Your Cart is Empty</h2>
                <p className="gray">Please add something in your cart</p>
              </div>
            ) : (
              <p></p>
            )}
          </div>
          <div className=" col-xl-5">
            <hr className="line2 mt-5" />
            <div className="row ml-1">
              <p>Subtotal</p>
              <p className="total">Rp. {zero ? "0" : data.pay}</p>
            </div>
            <div className="row ml-1">
              <p>Qty</p>
              <p className="total">{qty}</p>
            </div>
            <hr className="line2 mb-3" />
            <div className="row ml-1">
              <p>Total</p>
              <p className="total">Rp. {zero ? "0" : data.pay}</p>
            </div>

            <div className=" float-right mt-3">
              <form className="sub" onSubmit={(e) => submitImage(e)}>
                <div className="form-group">
                  <input
                    type="file"
                    id="actual-btn"
                    name="thumbnail"
                    onChange={(e) => onChange(e)}
                    hidden
                  />
                  <label for="actual-btn">
                    <img src={attach} alt="" className="mt-5 pointer imgcrt" />
                    <img src={filee} alt="" className="preview mb-2 pointer" />
                  </label>
                </div>

                <button
                  type="submit"
                  className="float-right blackBtn pay mr-4 mt-5"
                >
                  Pay
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className={`cartNo ${qty == 0 ? "hide" : ""}`}>
        <p>{qty}</p>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        className="pt-5 mt-5 fs-20 green avenir"
      >
        <Modal.Body className="center">
          Thank you for ordering in us, please wait 1 x 24 hours to verify your
          order
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Cart;
