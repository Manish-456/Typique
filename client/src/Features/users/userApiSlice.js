import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const userAdapter = createEntityAdapter({});
const initialState = userAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/api/user",
        method: "GET",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),

      transformResponse: (responseData) => {
        const loadedUser = responseData.map((user) => {
          user.id = user._id;
          return user;
        });

        return userAdapter.setAll(initialState, loadedUser);
      },

      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result?.ids.map((id) => ({
              type: "User",
              id,
            })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),

    getUser: builder.query({
      query: (id) => ({
        url: `/api/user/${id}`,
        method: "GET",
      }),
    }),

    updateUser: builder.mutation({
      query: (info) => ({
        url: `/api/user`,
        method: "PATCH",
        body: { ...info },
      }),
      invalidatesTags: (result, error, args) => {
        return [
          { type: "User", id: args.id }
        ];
      },
    }),
  }),
});

export const { useGetAllUsersQuery, useGetUserQuery, useUpdateUserMutation } =
  userApiSlice;

