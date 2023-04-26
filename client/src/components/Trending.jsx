import { FaFacebook, FaLinkedin, FaPinterest, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRef } from "react";
import Scroll from "../utils/Scroll";

import CardSlider from "./CardSlider";
import { Link } from "react-router-dom";
import { blogHelperQuery } from "../Helper/BlogHelper";

const Trending = () => {
  const iconDivClasses = "shadow-lg p-3  rounded-full";
  const carouselRef = useRef();
  const width = Scroll(carouselRef);
  const {data } = blogHelperQuery({trending : true})
  
  const blogs = data?.ids?.map(blogId => {
    return data?.entities[blogId]
  })
let content 
  if(blogs?.length > 0){
 content =  <div className="p-4 mt-10 font-bold text-xl ">
 <h1 className="md:text-[20px] text-[16px]">What's Trending</h1>
 <div className="flex mt-4 gap-8  flex-col">
   <div className="left-side  ">
     <motion.div ref={carouselRef} className="cursor-grab overflow-hidden">
       <motion.div
         drag="x"
         dragConstraints={{ right: 0, left: -width }}
         className="flex gap-4  "
       >
         {blogs.map((blog) => {
           return (
             <motion.div className="flex flex-row " key={blog.id}>
               <CardSlider isTrending data={blog} />
             </motion.div>
           );
         })}
       </motion.div>
     </motion.div>
   </div>
   <div className="right-side md:mt-0 mt-4">
     <h1 className="md:text-[20px] text-[16px]  mb-4">Stay Connected</h1>
     <hr className="mb-2" />
     <div className="flex justify-between p-4">
       <div className={iconDivClasses}>
        <Link target="_blank" to={`https://www.facebook.com/profile.php?id=100031055010485`}>
         <FaFacebook className="hover:text-blue-600 w-6 h-6" />
        </Link>
        
       </div>
       <div className={iconDivClasses}>
         <FaTwitter className="hover:text-blue-600 w-6 h-6" />
       </div>
       <div className={iconDivClasses}>
        <Link target="_blank" to={'https://www.linkedin.com/in/manish-tamang-22bb2225a/'}> <FaLinkedin className="hover:text-blue-600 w-6 h-6" /></Link>
       </div>
       <div className={iconDivClasses}>
         <FaPinterest className="hover:text-pink-600 w-6 h-6" />
       </div>
     </div>
   </div>
 </div>
</div>;
 }else{
  content = ""
 }
  
  
  return content;
};

export default Trending;