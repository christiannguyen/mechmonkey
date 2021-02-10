import React, { useRef, useEffect } from "react";

const useEffectAfterMount = (cb, dependencies) => {
  const justMounted = useRef(true);

  useEffect(() => {
    if (!justMounted.current) {
      return cb();
    }
    justMounted.current = false;
  }, dependencies);
};

export default useEffectAfterMount;
