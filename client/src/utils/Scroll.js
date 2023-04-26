import { useEffect, useState } from "react";

const Scroll = (ref) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {

    setWidth(ref?.current?.scrollWidth - ref?.current?.offsetWidth);
   
   return () => setWidth(0)
  }), [ref?.current];
  return width
};

export default Scroll;
