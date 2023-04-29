import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { blogHelperWithoutPolling } from "../Helper/BlogHelper";
import useTitle from "../hooks/useTitle";


const TopStoriesPage = () => {
  const [blogs, setBlogs] = useState([]);
 
  const {data} = blogHelperWithoutPolling({topStories : true});
  
  useEffect(() => {
    if (data) {
      const newBlogIds = [...data.ids];
 

      const newBlogs = newBlogIds.map((id) => data?.entities[id]);
      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
    }
    return () =>  setBlogs([])


  }, [data]);

  useTitle(`(${blogs?.length}) Top Stories`)


  return (
    <main className="max-w-7xl mx-auto px-6 md:px-4">
      <div className="p-4 mt-10">
        <div className="flex items-center justify-between md:flex-row flex-col gap-10">
          <div className="md:w-1/2 flex flex-col items-center  md:items-start">
            <h1 className=" text-4xl lg:text-5xl text-[var(--primary)] font-bold">
              Typique{" "}
            </h1>
            <h3 className="md:text-start text-center  mt-5 text-[18px] md:text-2xl  w-full">
              Redefining Blogging with Unique Typographic Styles
            </h3>
            
     
          </div>
          <div className="md:w-1/2">
          <img src="./top-stories-bg.png" alt="" />
        </div>
        </div>

     
        <div className="flex  flex-col gap-10">
           
            <h1 className="m-4  text-[var(--primary)] text-center font-bold text-3xl">
              Top Stories
            </h1>
        
          <div className="flex gap-2 flex-wrap ">
          {
            blogs?.map(blog => <BlogCard key={blog?.id} blogId={blog?.id} />)
          }
          </div>
          </div>
      </div>
    </main>
  );
};



export default TopStoriesPage;
