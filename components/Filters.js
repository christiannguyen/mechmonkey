import React, { useState } from "react";

const FILTER_OPTIONS = [
  {
    label: "Selling",
    value: "selling",
  },
  {
    label: "Buying",
    value: "buying",
  },
  {
    label: "Group Buy",
    value: "Group Buy",
  },
  {
    label: "Interest Check",
    value: "Interest Check",
  },
];

const Filters = ({ handler }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const handleChange = (idx) => {
    handler(FILTER_OPTIONS[idx].value);
    setSelectedIdx(idx);
  };

  return (
    <section className="mb-6">
      {FILTER_OPTIONS.map((filter, idx) => {
        const selected =
          idx === selectedIdx ? "pb-1 border-b-4 border-green-400 " : "";

        return (
          <span
            onClick={() => handleChange(idx)}
            className={`${selected} cursor-pointer dark:text-gray-300 mr-4`}
          >
            {filter.label}
          </span>
        );
      })}
    </section>
  );
};

export default Filters;
