import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";
const Payment_URL="/payment"

 const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    loginUrl: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/loginUrl`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PATCH",
        body: data,
      }),
    }),
    getUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    getPrice: builder.mutation({
      query: (data) => ({
        url: `${Payment_URL}/getPrice`,
        method: "POST",
        body: data,
      }),
    }),
    createSubscription: builder.mutation({
      query: (data) => ({
        url: `${Payment_URL}/create-subscription`,
        method: "POST",
        body: data,
      }),
    }),
    cancelSubscription: builder.mutation({
      query: (data) => ({
        url: `${Payment_URL}/cancel-subscription`,
        method: "POST",
        body: data,
      }),
    }),
    getToken: builder.query({
      query: () => ({
        url: `${USERS_URL}/token`,
      }),
    }),
    updateSubscription: builder.mutation({
      query: (data) => ({
        url: `${Payment_URL}/updateSubscription`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetTokenQuery,
  useLoginUrlMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useGetUserMutation,
  useResetPasswordMutation,
  useGetPriceMutation,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useUpdateSubscriptionMutation
} = userApiSlice;
