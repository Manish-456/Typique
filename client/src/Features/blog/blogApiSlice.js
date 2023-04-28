import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const blogsAdapter = createEntityAdapter({});
const initialState = blogsAdapter.getInitialState();
export const BlogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: (arg) => {
        return {
          url: `/api/blog`,
          ...(arg && {
            params: {
              size: arg.size,
              ...(arg.cat && {
                cat: arg.cat,
              }),
              ...(arg.page && {
                page : arg.page
              }),
              ...(arg.blog && {
                 blog : arg.blog
              }),
              ...(arg.topStories && {
                  topStories : arg.topStories
              }),
              ...(arg.sort && {
                sort: arg.sort,
              }),
              ...(arg.trending && {
                trending: arg.trending,
              }),
            },
          }),
          method: "GET",

          validateStatus: (response, result) => {
            return response.status === 200 && !result.isError;
          },
        };
      },
      transformResponse: (responseData) => {
        const loadedBlogs = responseData.map((blog) => {
          blog.id = blog._id;
          return blog;
        });
        return blogsAdapter.setAll(initialState, loadedBlogs);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Blog", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Blog", id })),
          ];
        } else {
          return [{ type: "Blog", id: "LIST" }];
        }
      },
    }),

    addNewBlogs: builder.mutation({
      query: (initialBlog) => ({
        url: "/api/blog",
        method: "POST",
        body: { ...initialBlog },
      }),
      invalidatesTags: [
        {
          type: "Blog",
          id: "LIST",
        },
      ],
    }),

    updateBlog: builder.mutation({
      query: (details) => ({
        url: `/api/blog/update`,
        
        method: "PUT",
        body: {
          ...details,
        },
      }),
     
      invalidatesTags: (result, error, arg) => [
        {
          type: "Blog",
          id: arg.blogId,
        },
      ],
    }),

    views : builder.mutation({
    query : (args) => ({
      url : `/api/blog/view/${args?.blogId}`,
      method : "PATCH"
    }),
    invalidatesTags : (result, error, args) => [{
      type : "Blog", id : args?.blogId
    }]
    }),

    like_dislike_post: builder.mutation({
      query: (args) => ({
        url: `/api/blog/like_dislike`,
        method: "PUT",
        body: {
          blogId: args.blogId,
          authorId: args.authorId,
          title: args.title,
          clientId: args.clientId,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Blog", id: arg.id }],
    }),

    deleteBlog: builder.mutation({
      query: ({ id }) => ({
        url: `/api/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Blog", id: arg.id }],
    }),

    createComment: builder.mutation({
      query: (data) => ({
        url: `/api/blog/comment/${data?.blogId}`,
        method: "POST",
        body: {
          ...data,
        },
      }),
      invalidatesTags: (result, error, arg) => {
       
        return [{ type: "Blog", id: arg?.blogId }]
      },
    }),

    getNotifications: builder.query({
      query: () => ({
        url: "/api/notification",
        method: "GET",
      }),
    }),
    editComment : builder.mutation({
      query : details => ({
        url : `/api/blog/comment/edit`,
        method : 'PATCH',
        body : {...details}
      }),
      invalidatesTags : (result, error, arg) =>   [
          {
            type : "Blog",
            id : arg.blogId
  
          }
        ]
      }
    ),
    deleteComment : builder.mutation({
      query : details => ({
        url : `/api/blog/comment/remove`,
        method : 'DELETE',
        body : {...details}
      }),
      invalidatesTags : (result, error, arg) =>   [
          {
            type : "Blog",
            id : "LIST"
  
          }
        ]
      }
    ),
  }),
});

export const {
  useGetBlogsQuery,
  useAddNewBlogsMutation,
  useLike_dislike_postMutation,
  useCreateCommentMutation,
  useGetNotificationsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useViewsMutation
} = BlogApiSlice;



