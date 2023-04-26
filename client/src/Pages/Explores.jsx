import BlogCard from "../components/BlogCard";

import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { useGetBlogsQuery } from "../Features/blog/blogApiSlice";
import useInfiniteScroll from "../hooks/useInfiniteScroll";


const Explores = () => {

  const [blogs, setBlogs] = useState([]);
  const [loadedBlogIds, setLoadedBlogIds] = useState(new Set())
   
  const location = useLocation();
 const params = new URLSearchParams(location?.search);

 const query = params.get('blog');

  const [page, setPage] = useState(1);
  const { data, isError } = useGetBlogsQuery(query ? {
    blog : query
  } : {page : page, size : 9});


 
  useEffect(() => {
    if (data) {
      const newBlogIds = new Set(data.ids);
     
  
      // Filter out the ids that are already loaded
      const filteredIds = [...newBlogIds].filter(id => !loadedBlogIds.has(id));
  
      // Add only the new blogs to the state
      const newBlogs = filteredIds.map(id => data.entities[id]);
      setBlogs(prevBlogs => [...prevBlogs, ...newBlogs]);
  
      // Add the new ids to the loadedBlogIds state
      setLoadedBlogIds(prevIds => new Set([...prevIds, ...filteredIds]));
    }
  }, [data]);
  
  useInfiniteScroll(setBlogs, setPage)
 

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 md:px-4">
        <div className="mt-10">
          <h1 className="md:text-3xl text-xl  mb-10 border-b border-gray-300 pb-3  text-center">
            Explore
          </h1>

          {query && <h1 className="mb-4 text-gray-400">Result for <span className="underline text-green-500 ">{query}</span></h1>}
         {isError ? <p className="text-xl text-center">No blog <span className="text-red-400 underline">{query}</span> found</p> :  <div className="flex flex-wrap md:gap-2 gap-4">
            {blogs?.map((blog) => (
              <BlogCard
              key={blog?.id}
                blogId={blog?.id}
                location={"/explore"}
                isTrending={false}
                isLatest={false}
              />
            ))}
          </div>}
        </div>
       
      </div>
    </>
  );
};

export default Explores;
