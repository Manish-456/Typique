import { useGetBlogsQuery } from "../Features/blog/blogApiSlice";

export const blogHelperQuery = (arg = null) => {
  return useGetBlogsQuery(arg ? arg : "blogLists", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
};
export const blogHelperWithoutPolling = (arg = null) => {
  return useGetBlogsQuery(arg ? arg : "blogLists");
};
export const blogwithUserIdQuery = (blogId) => {
  return useGetBlogsQuery("blogLists", {
    selectFromResult: ({ data }) => ({
      blog: data?.entities[blogId],
    }),
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
};

export const blogWithFixedSizeAndBlogIdQuery = (size, blogId) => {
  return useGetBlogsQuery({ size: size } || "blogLists", {
    selectFromResult: (result) => ({
      blog: result?.data?.entities[blogId],
    }),
  });
};
