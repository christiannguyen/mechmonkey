import React from "react";

const Search = ({ query, setQuery, handler }) => {
  return (
    <>
      <form onSubmit={handler}>
        <input
          className="py-2 pl-4 w-2/3 border-2 border-gray-100 outline-none rounded-lg search-input"
          type="text"
          placeholder="Search by title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </>
  );
};

export default Search;
