import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { API } from "../../config/axios";
import { AppContext } from "../../component/context/Global";
import { PromoteBook } from "../HomePage/promoteBook";
import Loader from "react-loader-spinner";
import bgw from '../LandingPage/img/bgw.jpg'

export const ShowBooks = () => {
  const [state] = useContext(AppContext);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const read = (bookId) => history.push(`/detail/${bookId}`);
  const [books, setBooks] = useState([]);
  const getBooks = async () => {
    try {
      setLoading(true);
      const books = await API.get("/books");
      setBooks(books.data.data.books);
      setLoading(false);
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
  useEffect(() => {
    getBooks();
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
    <div className="showBooks">
      <p className="fs-45 crimson">With us, you can shop online & help</p>
      <p className="fs-45 crimson">save your high street at the same time</p>
      <PromoteBook />
      {cart.map((Cart) => (
        <div className="row mb-5" key={Cart.id} hidden>
          <p>{qty++}</p>
        </div>
      ))}
      <p className="fs-35 mt-5 text-left listBook pl-3 timesNew">List Book</p>
      <div className="bgray">
        <div className="listBook row">
          {books.map((Books) => (
            <div className="col-lg-2 mr-4 pb-4 pt-4">
              <img
                src={Books.thumbnail}
                className="book  pointer"
                alt=""
                onClick={() => read(Books.id)}
              />
              <h2
                className="bold text-truncate pointer"
                onClick={() => read(Books.id)}
              >
                {Books.title}
              </h2>
              <p className="authorC text-left">{Books.author}</p>
              <p className="priceC text-left">Rp. {Books.price}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={`cartNo ${qty == 0 || !state.isLogin ? "hide" : ""}`}>
        <p>{qty}</p>
      </div>
    </div>
  );
};
