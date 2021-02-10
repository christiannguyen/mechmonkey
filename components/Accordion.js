import React, { useState, useRef, useEffect } from "react";

const Accordion = (props) => {
  const [active, setActive] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      const height = Math.max(
        contentRef.current.children[0].scrollHeight,
        contentRef.current.scrollHeight
      );
      contentRef.current.style.maxHeight = active ? `${height}px` : "0px";
    }, 0);
  }, [contentRef, active]);

  const toggleActive = (e) => {
    console.log("e", e);
    setActive(!active);
  };

  return (
    <div className="mt-8 mb-14 bg-white rounded-xl shadow-xl  relative">
      <div className="cursor-pointer" onClick={toggleActive}>
        {props.header(active)}
      </div>

      <div
        ref={contentRef}
        className=" px-8 transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div className="border-t-2 border-indigo-400 pb-6">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
