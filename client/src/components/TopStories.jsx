import StoryList from "./StoryList";
import { blogHelperQuery } from "../Helper/BlogHelper";

import { Link, useNavigate } from "react-router-dom";
const TopStories = () => {
  const navigate = useNavigate();
  const { data } = blogHelperQuery({ topStories: true });

  const handleStories = () => navigate("/topstories");

  return (
    <>
      {data?.ids?.slice(0, 3).map((blogId) => (
        <Link key={blogId} to={`/blog/${blogId}`}><StoryList  size={3} blogId={blogId} /></Link>
      ))}
     {data && <h1 className="cursor-pointer hover:underline" onClick={handleStories}>
        See More...
      </h1>}
    </>
  );
};

export default TopStories;
