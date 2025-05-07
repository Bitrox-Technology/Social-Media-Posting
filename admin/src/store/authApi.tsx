import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setAdmin, logout } from './authSlice.tsx';
import { backendURL } from "../constants/urls.tsx";
import { Params } from 'react-router-dom';

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}



export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: backendURL ,
    prepareHeaders: (headers, { getState }: { getState: () => unknown }) => {
      const dispatch = (action: any) => { }; 
      const state = getState() as { app?: { user?: { token?: string; expiresAt?: number; email?: string } } };
      let token = state.app?.user?.token;

      if (!token) {
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
          const admin = JSON.parse(storedAdmin);
          token = admin.token;
          const expiresAt = admin.expiresAt;

          if (expiresAt && Date.now() > expiresAt) {
            dispatch(logout());
            localStorage.removeItem('admin');
            window.location.href = '/login';
            return headers;
          }

          dispatch(setAdmin(admin));
        }
      }

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    signUp: builder.mutation<ApiResponse<any>, { email: string; password: string }>({
      query: (body) => ({
        url: '/admin/signup',
        method: 'POST',
        body,
      }),
    }),
    verifyOTP: builder.mutation<ApiResponse<any>, { email: string; otp: string}>({
      query: (body) => ({
        url: '/admin/verify-otp',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, email } = data.data;
          const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day in milliseconds

          // Store in Redux
          const adminData = { email, token: accessToken, expiresAt };
          dispatch(setAdmin(adminData));

          // Store in localStorage
          localStorage.setItem('admin', JSON.stringify(adminData));
        } catch (error) {
          alert(`OTP verify failed:, ${error}`);
        }
      },
      invalidatesTags: ['Auth'],
    }),
    resendOTP: builder.mutation<ApiResponse<any>, { email: string; }>({
      query: (body) => ({
        url: '/admin/resend',
        method: 'POST',
        body,
      }),
    }),
    forgetPassword: builder.mutation<ApiResponse<any>, { email: string; newPassword: string }>({
      query: (body) => ({
        url: '/admin/forget-password',
        method: 'POST',
        body,
      }),
    }),
    signIn: builder.mutation<ApiResponse<any>, { email: string; password: string }>({
      query: (body) => ({
        url: '/admin/signin',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, email } = data.data;
          const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day in milliseconds

          // Store in Redux
          const adminData = { email, token: accessToken, expiresAt };
          dispatch(setAdmin(adminData));

          // Store in localStorage
          localStorage.setItem('admin', JSON.stringify(adminData));
        } catch (error) {
          alert(`Sign-in failed:, ${error}`);
        }
      },
      invalidatesTags: ['Auth'],
    }),
    updateAdminProfile: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/admin/update-profile',
        method: 'PUT',
        body: formData,
      }),
    }),
    getAdminProfile: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/admin/get-profile',
        method: 'GET',
      }),
    }),
    getAllUsers: builder.query<ApiResponse<any>, {page: number; limit: number}>({
      query: (params) => ({
        url: '/admin/get-all-users',
        method: 'GET',
        params, 
      }),
    }),
    getUser: builder.query<ApiResponse<any>, {userId: string}>({
      query: ({userId}) => ({
        url: `/admin/get-user/${userId}`,
        method: 'GET', 
      }),
    }),
  }),
});

export const { 
  useSignUpMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useForgetPasswordMutation,
  useSignInMutation,
  useUpdateAdminProfileMutation,
  useLazyGetAdminProfileQuery,
  useLazyGetAllUsersQuery,
  useLazyGetUserQuery,
 } = authApi;