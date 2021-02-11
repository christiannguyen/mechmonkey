import React, { useState, useRef, useEffect } from "react";
import useEffectAfterMount from "../hooks/useEffectAfterMount";

const Accordion = (props) => {
  const [active, setActive] = useState(true);
  const contentRef = useRef(null);

  useEffectAfterMount(() => {
    const height = Math.max(
      contentRef.current.children[0].scrollHeight,
      contentRef.current.scrollHeight
    );

    contentRef.current.style.maxHeight = active ? `${height}px` : "0px";
  }, [contentRef, active]);

  const toggleActive = () => {
    setActive(!active);
  };

  return (
    <div className="mt-8 mb-14 bg-white rounded-xl shadow-xl relative dark:bg-gray-800 dark:bg-opacity-100">
      <div className="cursor-pointer" onClick={toggleActive}>
        {props.header(active)}
      </div>

      <div
        ref={contentRef}
        className=" px-8 transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div className="border-t-2 border-blue-400 pb-6 dark:border-indigo-300">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
