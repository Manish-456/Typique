import React from "react";
import { useDeleteBlogMutation } from "../Features/blog/blogApiSlice";


const BlogDialogue = ({ setOpenDialogue, blogId, title }) => {
  const [deleteBlog] = useDeleteBlogMutation();

  const handleDeleteBlog = async () => {
    try {
      await deleteBlog({ id: blogId });
      setOpenDialogue(false);
    } catch (error) {}
  };

  return (
    <div className={` p-2`}>
      <div className="p-2">
        <h1>
          {" "}
          Do you really want to delete{" "}
          <span className=" text-blue-500">"{title}"</span>?{" "}
        </h1>
        <div className="flex justify-end mr-4 mt-4 gap-10">
          <p onClick={handleDeleteBlog} className="text-red-500 cursor-pointer">
            Yes
          </p>
          <p
            className="text-green-500 cursor-pointer"
            onClick={() => setOpenDialogue(false)}
          >
            No
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogDialogue;
