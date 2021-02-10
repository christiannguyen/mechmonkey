import React from "react";

const Search = ({ query, setQuery, handler }) => {
  return (
    <>
      <form onSubmit={handler}>
        <input
          className="py-2 pl-4 w-1/2 border-2 shadow-lg border-gray-200 outline-none rounded-lg"
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
