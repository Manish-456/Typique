import { Link } from "react-router-dom";
import { userWithUserIdQuery } from "../Helper/UserHelper";
import useDOMParser from "../hooks/useDOMParser";
import { useViewsMutation } from "../Features/blog/blogApiSlice";

const BlogList = ({ title, desc, image, userId, id, createdAt }) => {
  const created = new Date(createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
  });
  const { user } = userWithUserIdQuery(userId);
  const truncatedText = useDOMParser(desc, 40);
  const [view] = useViewsMutation();
  const handleView = async() => {
    try {
      await view({blogId : id})
    } catch (error) {
      
    }
  }
  return (
    <Link to={`/blog/${id}`} className="flex shadow-sm gap-4">
      <img
       onClick={handleView}
        src={`${image}` || "/noblogimg.png"}
        alt=""
        className="w-[5rem] h-20 object-cover"
      />

      <div>
        <h1 onClick={handleView} className="md:text-[14px] text-[13px] font-bold">
          {title?.length < 20 ? title : `${title?.slice(0, 30)}...`}
        </h1>
        <p className="text-sm mt-3 text-[11.5px] md:text-[13px] text-gray-400">
          {truncatedText}
        </p>
        <Link to={`/profile/${userId}`} className="text-[12px] md:text-[13px] mt-4 text-gray-400">
          {user?.username} <span className="text-blue-900">{created}</span>
        </Link>
      </div>
    </Link>
  );
};

export default BlogList;
