import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom";
import { API } from "../../config/axios";
import { createBrowserHistory } from "history";

export const PromoteBook = () => {
  const history = useHistory();
  const history2 = createBrowserHistory();
  const path = history2.location.pathname;

  const [texta, setTexta] = useState(
    " Ambiti onid edisse scripsisse iudica retur. Cras mattis iudicium purus sit amet fermentum. Donec sed odiAmbitioni dedisse scripsisse iudica retur. Cras mattis iudicium purus sit  "
  );
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [text, setText] = useState(
    "The product is successfully added to the cart"
  );
  const handleClose = () => {
    setShow(false);
    history.push(`/loading${path}`);
  };
  const [books, setBooks] = useState([]);

  const getBooks = async () => {
    try {
      setLoading(true);
      const findBook = await API.get("/promo");
      setBooks(findBook.data.data.books);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getBook = async (id) => {
    try {
      const findBook = await API.get(`/book/${id}`);
      const ok = findBook.data.data.book.price;
      console.log(ok);
      checkBook(id, ok);
    } catch (error) {
      console.log(error);
    }
  };
  const [cek, sett] = useState([]);
  const checkBook = async (id, ok) => {
    try {
      const findBook = await API.get(`/checkBook/${id}`);
      sett(findBook.data.data.book);
      addCart(id, ok);
    } catch (error) {
      console.log(error);
    }
  };

  const addCart = async (id, ok) => {
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
        setShow(true);
        const item = await API.get("/getsum");

        if (item.data.status === "error") {
          const create = JSON.stringify({
            qty: 1,
            pay: ok,
          });
          await API.post("/addsum", create, config);
        } else if (item.data.status === "success") {
          const data = item.data.data.sum;
          const edit = JSON.stringify({
            qty: data.qty + 1,
            pay: data.pay + ok,
          });
          await API.patch("/editsum", edit, config);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBooks();
  }, []);
  return (
    <div className="row">
      {books.map((Books) => (
        <div className="popularBook mt-5 ml-3 col-lg-5 " key={Books.id}>
          <Link to={`/detail/${Books.id}`} as={Link} className="">
            <img
              src={Books.thumbnail}
              className="float-left  mr-2 pr-1 imgCover "
              alt=""
            />
          </Link>
          <div className="text-left ">
            <p className="title"> {Books.title}</p>
            <p className="gray author">{Books.author}</p>
            <p className="description ">{`${texta.substring(0, 100)}
        ...`}</p>
            <p className="price">Rp. {Books.price}</p>
            <button
              className="tombol blackBtn btnCart"
              onClick={() => getBook(Books.id)}
            >
              Add to Cart
            </button>
            {cek.map((Cek) => (
              <div className="" key={Cek.id}>
                <a href={Cek.book.bookAttachment} className="" target="_blank">
                  <button className="tombol blackBtn btnCart2 ">
                    Download
                  </button>
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Modal
        show={show}
        onHide={handleClose}
        className="pt-5 mt-5 fs-20 green avenir "
      >
        <Modal.Body className="center">{text}</Modal.Body>
      </Modal>
    </div>
  );
};
