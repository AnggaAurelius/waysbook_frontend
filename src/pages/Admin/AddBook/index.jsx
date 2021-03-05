import React, { useState } from "react";
import add from "./img/addBtn.png";
import ic from "./img/ic_attach.png";
import bgw from "../../bgw.jpg";
import { Modal } from "react-bootstrap";
import { API } from "../../../config/axios";
import Navbar from "../../../component/Navbar";

export const AddBook = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [form, setForm] = useState({
    title: "",
    publicationDate: "",
    pages: "",
    author: "",
    ISBN: "",
    price: "",
    description: "",
    thumbnail: null,
    bookAttachment: null,
  });

  const onChange = (e) => {
    const updateForm = { ...form };
    updateForm[e.target.name] =
      e.target.type === "file" ? e.target.files[0] : e.target.value;
    setForm(updateForm);
  };

  const {
    title,
    publicationDate,
    pages,
    author,
    ISBN,
    price,
    description,
    thumbnail,
    bookAttachment,
  } = form;

  const submitBook = async (e) => {
    e.preventDefault();

    try {
      const body = new FormData();

      body.append("title", title);
      body.append("publicationDate", publicationDate);
      body.append("pages", pages);
      body.append("author", author);
      body.append("ISBN", ISBN);
      body.append("price", price);
      body.append("description", description);
      body.append("thumbnail", thumbnail);
      body.append("bookAttachment", bookAttachment);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      await API.post("/upload-book", body, config);
      setShow(true);
      setForm({
        title: "",
        publicationDate: "",
        pages: "",
        author: "",
        ISBN: "",
        price: "",
        description: "",
        thumbnail: null,
        bookAttachment: null,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" bgImage" style={{ backgroundImage: `url( ${bgw})` }}>
      <Navbar />
      <div className="mlr ">
        <h1 className="mbot timesNew text-left">Add Book</h1>
        <form className="" onSubmit={(e) => submitBook(e)}>
          <div className="form-group formsub mt-5 avenir ">
            <input
              type="text"
              className="formsub w00 pl-3 fs-18"
              value={title}
              onChange={(e) => onChange(e)}
              placeholder="Title"
              name="title"
            />
          </div>
          <div className="form-group formsub mt-5">
            <input
              type="text"
              className="formsub w00 pl-3 fs-18"
              value={publicationDate}
              onChange={(e) => onChange(e)}
              placeholder="Publication Date"
              name="publicationDate"
            />
          </div>
          <div className="form-group formsub mt-5">
            <input
              type="text"
              className="formsub w00 pl-3 fs-18"
              value={pages}
              onChange={(e) => onChange(e)}
              placeholder="Pages"
              name="pages"
            />
          </div>
          <div className="form-group formsub mt-5">
            <input
              type="text"
              className="formsub w00 pl-3 fs-18"
              value={author}
              onChange={(e) => onChange(e)}
              placeholder="Author"
              name="author"
            />
          </div>
          <div className="form-group formsub mt-5">
            <input
              type="text"
              className="formsub w00 pl-3 fs-18"
              value={ISBN}
              onChange={(e) => onChange(e)}
              placeholder="ISBN"
              name="ISBN"
            />
          </div>
          <div className="form-group formsub mt-5">
            <input
              type="text"
              className="formsub w00 pl-3 fs-18"
              value={price}
              onChange={(e) => onChange(e)}
              placeholder="Price"
              name="price"
            />
          </div>
          <div className="form-group txtarea mt-5 ">
            <textarea
              type="text"
              className="txtarea w00 pl-3 pt-2 fs-18"
              value={description}
              onChange={(e) => onChange(e)}
              placeholder="About this book"
              name="description"
            />
          </div>
          <div className="form-group mt-4">
            <input
              type="file"
              id="actual-btn"
              onChange={(e) => onChange(e)}
              name="bookAttachment"
              className="inputFile"
              hidden
            />
            <label for="actual-btn" className="coverBtn bold pointer ">
              Attache Pdf File
              <img className="float-right ml-3" src={ic} alt="" />
            </label>
          </div>
          <div className="form-group mt-3  ">
            <input
              type="file"
              id="actual-btn2"
              onChange={(e) => onChange(e)}
              name="thumbnail"
              className="inputFile"
              hidden
            />
            <label for="actual-btn2" className="coverBtn bold pointer  ">
              Attache Book File
              <img className="float-right ml-2" src={ic} alt="" />
            </label>
          </div>
          <button
            className=" mt-4 bold subtn avenir pl-3 float-right blackBtn white"
            type="submit"
          >
            Add Book
            <img className="ml-3" src={add} alt="" />
          </button>
          <br />
        </form>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        className="pt-5 mt-5 fs-20 green avenir"
      >
        <Modal.Body className="center">Successfully added book</Modal.Body>
      </Modal>
    </div>
  );
};

export default AddBook;
