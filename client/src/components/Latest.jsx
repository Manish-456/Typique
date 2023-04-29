import { motion } from "framer-motion";
import CardSlider from "./CardSlider";
import { useRef } from "react";
import Scroll from "../utils/Scroll";

import { blogHelperQuery } from "../Helper/BlogHelper";
const Latest = () => {
  const carouselRef = useRef(null);
  const width = Scroll(carouselRef);
  
  const {data} = blogHelperQuery({sort : true});

  const blogs = data?.ids?.map(blogId => data.entities[blogId]);
  
 

  return (
    <div className="p-4 mt-10">
      <h1 className="mb-6 font-bold md:text-[20px] text-[16px]">Latest Article</h1>
      <div className="flex gap-4 flex-col">
        <motion.div ref={carouselRef} className="cursor-grab overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            className="flex gap-4  "
          >
            {blogs?.map((blog) => {
              return (
                <motion.div key={blog.id} className="flex flex-row " >
                  <CardSlider  isTrending data={blog} />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Latest;
