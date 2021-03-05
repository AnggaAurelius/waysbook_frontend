import React from "react";

export const Pagination = ({ perPage, total, handlePage }) => {
  const pageNumber = [];

  for (let i = 1; i <= Math.ceil(total / perPage); i++) {
    pageNumber.push(i);
  }
  return (
    <nav>
      <ul className="pagination navPg">
        {pageNumber.map((number) => (
          <li key={number} className="page-item mt-2 mr-2">
            <button
              className=" btn btn-primary"
              onClick={() => handlePage(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
