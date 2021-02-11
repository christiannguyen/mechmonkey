import React, { useState } from "react";

const Search = React.forwardRef(({ handler }, ref) => {
  const [query, setQuery] = useState("");

  return (
    <>
      <form onSubmit={handler}>
        <input
          ref={ref}
          className="py-3 pl-4 w-full border-2 border-gray-100 outline-none rounded-lg search-input dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-300"
          type="text"
          placeholder="Search by title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </>
  );
});

export default Search;
