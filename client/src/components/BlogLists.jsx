
import { blogHelperQuery } from "../Helper/BlogHelper"

import BlogList from "./BlogList"

const BlogLists = ({cat}) => {


  const {data : blog, isLoading} = blogHelperQuery({size : 5, cat : cat})
 const blogs = blog?.ids?.map((id) => {
  return blog?.entities[id]
 });


 

  return (
    <div className="flex flex-col gap-4 mt-1">
     {isLoading ? <p>Loading Please wait...</p> : blogs?.map((blog) => 
      {
        return <BlogList key={blog._id} {...blog}/>
    
      } )}  
    </div>
  )
}

export default BlogLists