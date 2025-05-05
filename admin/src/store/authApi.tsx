import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setAdmin, logout } from './authSlice.tsx';
import { backendURL } from "../constants/urls.tsx";

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
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          token = user.token;
          const expiresAt = user.expiresAt;

          if (expiresAt && Date.now() > expiresAt) {
            dispatch(logout());
            localStorage.removeItem('user');
            window.location.href = '/signin';
            return headers;
          }

          dispatch(setAdmin(user));
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
        url: '/user/verify-otp',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, email } = data.data;
          const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day in milliseconds

          // Store in Redux
          const userData = { email, token: accessToken, expiresAt };
          dispatch(setAdmin(userData));

          // Store in localStorage
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          alert(`OTP verify failed:, ${error}`);
        }
      },
      invalidatesTags: ['Auth'],
    }),
    resendOTP: builder.mutation<ApiResponse<any>, { email: string; }>({
      query: (body) => ({
        url: '/user/resend',
        method: 'POST',
        body,
      }),
    }),
    forgetPassword: builder.mutation<ApiResponse<any>, { email: string; newPassword: string }>({
      query: (body) => ({
        url: '/user/forget-password',
        method: 'POST',
        body,
      }),
    }),
    signIn: builder.mutation<ApiResponse<any>, { email: string; password: string }>({
      query: (body) => ({
        url: '/user/signin',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, email } = data.data;
          const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day in milliseconds

          // Store in Redux
          const userData = { email, token: accessToken, expiresAt };
          dispatch(setAdmin(userData));

          // Store in localStorage
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          alert(`Sign-in failed:, ${error}`);
        }
      },
      invalidatesTags: ['Auth'],
    }),
    userDetails: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/user/user-details',
        method: 'POST',
        body: formData,
      }),
    }),
    getUserProfile: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/user/get-user-profile',
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
  useUserDetailsMutation,
  useGetUserProfileQuery,
 } = authApi;