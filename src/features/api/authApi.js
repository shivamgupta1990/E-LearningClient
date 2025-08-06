import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:4000/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include"
  }),
  endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (inputData) => ({
        url: "signup",
        method: "POST",
        body: inputData
      })
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData
      }),
      async onQueryStarted(arg, {queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("loginUser result->",result)
          dispatch(userLoggedIn({ user:result.data.user }));
        } catch (err) {
          console.log(err);
        }
      }
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(arg, {_, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (err) {
          console.log(err);
        }
      }
    }),
    loadUser:builder.query({
      query:()=>({
        url:"profile",
        method:"GET"
      }),
      async onQueryStarted(arg, {queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("loadUser result->",result)
          dispatch(userLoggedIn({ user:result.data.user }));
        } catch (err) {
          console.log(err);
        }
      }
    }),
    updateUser:builder.mutation({
      query:(formData)=>({
        url:"profile/update",
        method:"PUT",
        body:formData,
        credentials:"include"
      })
    })
  })
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useLogoutUserMutation
} = authApi;
