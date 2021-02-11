import React from "react";

const Search = ({ query, setQuery, handler }) => {
  return (
    <>
      <form onSubmit={handler}>
        <input
          className="py-2 pl-4 w-full border-2 border-gray-100 outline-none rounded-lg search-input dark:bg-gray-600 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-300"
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
