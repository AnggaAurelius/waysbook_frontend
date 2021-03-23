import React, { useState, useEffect } from "react";
import "./table.css";
import aksi from "./img/aksi.png";
import blue from "./img/blue.png";
import bgw from "../../bgw.jpg";
import { API } from "../../../config/axios";
import { Button, Modal } from "react-bootstrap";
import Navbar from "../../../component/Navbar";
import { Pagination } from "./Pagination";

export const List = () => {
  let no = 0;
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState("");
  const handleClose = () => setShow(false);
  const [image, setImg] = useState("");
  const handleShow = (img) => {
    setImg(img);
    setShow(true);
    setModal("transfer");
  };

  const [transaction, setTransactions] = useState([]);
  const getTransaction = async () => {
    try {
      setLoading(true);
      const transactions = await API.get("/transactions");
      setLoading(false);
      setTransactions(transactions.data.data.transactions);
    } catch (error) {
      console.log(error);
    }
  };
  const num = [];
  for (let i = 1; i <= transaction.length; i++) {
    num.push(i);
  }

  const payment = async (id, action) => {
    try {
      const body = JSON.stringify({
        payment: action,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await API.patch(`/transaction/${id}`, body, config);
      getTransaction();

      if (action === "Approve") {
        const body2 = JSON.stringify({
          status: "true",
        });
        await API.patch(`/approveBook/${id}`, body2, config);
      } else {
        const body2 = JSON.stringify({
          status: "cancel",
        });
        await API.patch(`/cancelBook/${id}`, body2, config);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [books, setBooks] = useState([]);
  const theirBook = async (id) => {
    try {
      setLoading(true);
      const theirBooks = await API.get(`/theirBook/${id}`);
      setLoading(false);
      setBooks(theirBooks.data.data.book);
      setShow(true);
      setModal("book");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTransaction();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);

  const lastIndex = currentPage * perPage;
  const firstIndex = lastIndex - perPage;

  const newTransacion = transaction.slice(firstIndex, lastIndex);
  const number = num.slice(firstIndex, lastIndex);

  const handlePage = (pageNumber) => setCurrentPage(pageNumber);
  return loading ? (
    <p></p>
  ) : (
    <div className="minBG bgImage" style={{ backgroundImage: `url( ${bgw})` }}>
      <Navbar />
      <div className="mlr ">
        <h1 className="mbot timesNew">Incoming Transaction</h1>
        <table className="w00  content-table ">
          <thead>
            <tr className="red text-center">
              <th scope="co">No</th>
              <th scope="col">Name</th>
              <th scope="col">Evidence of Transfer</th>
              <th scope="col">Product Purchased</th>
              <th scope="col">Total Payment</th>
              <th scope="col">Status Payment</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {newTransacion.map((Transaction) => (
              <tr key={Transaction.id}>
                <th scope="row">{number[no++]}</th>
                <td>{Transaction.user.fullName}</td>
                <td>
                  <Button
                    className="ml-3"
                    variant="success"
                    onClick={() => handleShow(Transaction.attachment)}
                  >
                    Image
                  </Button>
                </td>
                <td>
                  <Button
                    className="ml-3"
                    variant="primary"
                    onClick={() => theirBook(Transaction.id)}
                  >
                    Detail
                  </Button>
                </td>
                <td
                  className={`roboto ${
                    Transaction.payment === "Approve" ? "approve" : "red"
                  }`}
                >
                  {Transaction.sum}
                </td>
                <td
                  className={`roboto ${
                    Transaction.payment === "Approve"
                      ? "approve"
                      : Transaction.payment === "Cancel"
                      ? "red"
                      : "text-warning"
                  }`}
                >
                  {Transaction.payment}
                </td>
                <td>
                  <div
                    className={`dropdown ${
                      Transaction.payment === "Approve" ||
                      Transaction.payment === "Cancel"
                        ? "hide"
                        : " aksi"
                    }`}
                  >
                    <img
                      className={`${
                        Transaction.payment === "Approve" ||
                        Transaction.payment === "Cancel"
                          ? "hide"
                          : ""
                      }`}
                      src={aksi}
                      alt=""
                    />
                    <img
                      className={`blueTick ${
                        Transaction.payment === "Approve" ||
                        Transaction.payment === "Cancel"
                          ? ""
                          : "hide"
                      }`}
                      src={blue}
                      alt="ok"
                    />
                    <div
                      className={`${
                        Transaction.payment === "Approve" ||
                        Transaction.payment === "Cancel"
                          ? "hide"
                          : "dropdown-content"
                      }`}
                    >
                      <div className="">
                        <p
                          className="approve bold center "
                          onClick={() => payment(Transaction.id, "Approve")}
                        >
                          Approved
                        </p>
                      </div>
                      <div className="">
                        <p
                          className="red bold center"
                          onClick={() => payment(Transaction.id, "Cancel")}
                        >
                          Cancel
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          perPage={perPage}
          total={transaction.length}
          handlePage={handlePage}
        />
        <Modal show={show} onHide={handleClose}>
          <Modal.Body className="center pt-4 pl-4">
            {modal === "transfer" ? (
              <img src={image} className=" trsfProof" alt="" />
            ) : (
              books.map((Purchased) => (
                <div className="row mb-5" key={Purchased.id}>
                  {/* <p hidden>{qty++}</p> */}
                  <img
                    src={Purchased.book.thumbnail}
                    alt=""
                    className="imgOrder"
                  />
                  <div className=" ml-1 text-left">
                    <p className="timesNew fs-25" style={{ width: 310 }}>
                      {Purchased.book.title}
                    </p>
                    <p className=" gray authorOr">{Purchased.book.author}</p>
                    <p className="priceOr">Rp. {Purchased.book.price}</p>
                  </div>
                </div>
              ))
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default List;
