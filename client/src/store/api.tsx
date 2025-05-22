import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { setUser, clearUser, setCsrfToken, clearCsrfToken } from './appSlice';
import { backendURL } from '../constants/urls';

interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

interface CarouselContent {
  tagline?: string;
  title: string;
  description?: string;
}

interface GenerateDoYouKnowResponse {
  title: string;
  description: string;
}

interface GenerateTopicsResponse {
  topics: string[];
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

interface SavePostRequest {
  postContentId: string;
  topic: string;
  type: 'image' | 'carousel' | 'doyouknow';
  status?: 'pending' | 'error' | 'success';
  images?: { url: string; label: string }[];
  contentId?: string;
  contentType?: 'ImageContent' | 'CarouselContent' | 'DYKContent';
}
interface JwtPayload {
  _id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
const baseQueryWithDispatch: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { dispatch, getState } = api;
  const baseQuery = fetchBaseQuery({
    baseUrl: backendURL,
    credentials: 'include', // Ensure cookies (e.g., accessToken, connect.sid) are sent
    prepareHeaders: async (headers, { getState, endpoint }) => {
      const state = getState() as {
        app?: {
          user?: { token?: string; expiresAt?: number; email?: string };
          csrfToken?: string;
          csrfTokenExpiresAt?: number;
        };
      };
      let token = state.app?.user?.token;
      let csrfToken = state.app?.csrfToken;
      let csrfTokenExpiresAt = state.app?.csrfTokenExpiresAt;

      console.log("TOken-----------",token, csrfToken, csrfTokenExpiresAt)

      // Retrieve accessToken from cookie
      if (token === undefined) {
        const cookieToken = Cookies.get('accessToken');

        if (cookieToken) {
          const decoded: JwtPayload = jwtDecode(cookieToken);
          const expiresAt = decoded.exp * 1000; // Convert seconds to milliseconds
          const email = decoded.email;
          console.log("COokie Token", decoded, expiresAt,cookieToken )

          if (Date.now() > expiresAt) {
            dispatch(clearUser());
            dispatch(clearCsrfToken());
            Cookies.remove('accessToken');
            Cookies.remove('accessTokenExpiresAt');
            window.location.href = '/signin';
            return headers;
          }

          token = cookieToken;
          dispatch(setUser({ email, token, expiresAt }));
        }
      }

      // Set Authorization header
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      // Skip CSRF token for safe methods
      const ignoredMethods = ['GET', 'HEAD', 'OPTIONS'];
      const method = typeof args === 'string' ? 'GET' : args.method || 'GET';
      if (ignoredMethods.includes(method)) {
        return headers;
      }

      // Check if CSRF token is expired or missing
      if (csrfToken === undefined || csrfTokenExpiresAt === undefined || Date.now() > csrfTokenExpiresAt) {
        try {
          const response = await fetch(`${backendURL}/csrf/csrf-token`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
          }

          const data = await response.json();
          if (data.success) {
            csrfToken = data.data.csrfToken;
            const expiresAt = data.data.expiresAt || Date.now() + 24 * 60 * 60 * 1000;
            if (typeof csrfToken === 'string') {
              dispatch(setCsrfToken({ token: csrfToken, expiresAt }));
            } else {
              throw new Error('CSRF token is undefined');
            }
          } else {
            throw new Error('CSRF token fetch failed');
          }
        } catch (error) {
          console.error('Error fetching CSRF token:', error);
          throw error;
        }
      }

      // Set CSRF token header
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }

      console.log('Request headers:', {
        method,
        url: typeof args === 'string' ? args : args.url,
        headers: Object.fromEntries(headers),
        sessionId: Cookies.get('connect.sid'),
      });
      return headers;
    },
  });


  return baseQuery(args, api, extraOptions);
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithDispatch,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    getCsrfToken: builder.query<ApiResponse<{ csrfToken: string; expiresAt: number }>, void>({
      query: () => ({
        url: '/csrf/csrf-token',
        method: 'GET',
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { csrfToken } = data.data;
          dispatch(setCsrfToken({ token: csrfToken, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }));
        } catch (error) {
          console.error('Failed to fetch CSRF token:', error);
        }
      },
    }),
    generateIdeas: builder.mutation<ApiResponse<ContentIdea[]>, { topic: string }>({
      query: (body) => ({
        url: '/ideas',
        method: 'POST',
        body,
      }),
    }),
    generateImage: builder.mutation<ApiResponse<string>, { prompt: string }>({
      query: (body) => ({
        url: '/generate-image',
        method: 'POST',
        body,
      }),
    }),
    postContent: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/post',
        method: 'POST',
        body: formData,
      }),
    }),
    generateCarousel: builder.mutation<ApiResponse<CarouselContent[]>, { topic: string }>({
      query: (body) => ({
        url: '/generate-carousel',
        method: 'POST',
        body,
      }),
    }),
    uploadCarouselToCloudinary: builder.mutation<ApiResponse<any>, FormData>({
      query: (body) => ({
        url: '/upload-carousel',
        method: 'POST',
        body,
      }),
    }),
    uploadImageToCloudinary: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/upload-single',
        method: 'POST',
        body: formData,
      }),
    }),
    generateDoYouKnow: builder.mutation<ApiResponse<any>, { topic: string }>({
      query: (body) => ({
        url: '/generate-doyouknow',
        method: 'POST',
        body,
      }),
    }),
    signUp: builder.mutation<ApiResponse<any>, { email: string; password: string; }>({
      query: (body) => ({
        url: '/user/signup',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { csrfToken } = data.data;
          dispatch(setCsrfToken({ token: csrfToken, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }));
        } catch (error) {
          console.error('Failed to fetch CSRF token:', error);
        }
      },
    }),
    signUpAndSigninByProvider: builder.mutation<ApiResponse<any>, { email: string; provider: string; uid: string }>({
      query: (body) => ({
        url: '/user/provider',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { csrfToken } = data.data;
          const cookieToken = Cookies.get('accessToken');
          if (cookieToken) {
            const decoded: JwtPayload = jwtDecode(cookieToken);
            const expiresAt = decoded.exp * 1000;
            const email = decoded.email;
            dispatch(setUser({ email, token: cookieToken, expiresAt }));

            console.log(csrfToken)
            dispatch(setCsrfToken({ token: csrfToken, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }));
          }
        } catch (error) {
         console.error('Failed to fetch CSRF token:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),
    verifyOTP: builder.mutation<ApiResponse<any>, { email: string; otp: string }>({
      query: (body) => ({
        url: '/user/verify-otp',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { csrfToken } = data.data;
          const cookieToken = Cookies.get('accessToken');
          if (cookieToken) {
            const decoded: JwtPayload = jwtDecode(cookieToken);
            const expiresAt = decoded.exp * 1000;
            const email = decoded.email;
            dispatch(setUser({ email, token: cookieToken, expiresAt }));
            dispatch(setCsrfToken({ token: csrfToken, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }));
          }
        } catch (error) {
         console.error('Failed to fetch CSRF token:', error);
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
    signIn: builder.mutation<ApiResponse<any>, { email: string; password: string; }>({
      query: (body) => ({
        url: '/user/signin',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { csrfToken } = data.data;
          const cookieToken = Cookies.get('accessToken');
          if (cookieToken) {
            const decoded: JwtPayload = jwtDecode(cookieToken);
            const expiresAt = decoded.exp * 1000;
            const email = decoded.email;
            dispatch(setUser({ email, token: cookieToken, expiresAt }));
            dispatch(setCsrfToken({ token: csrfToken, expiresAt: Date.now() + 24 * 60 * 60 * 1000 }));
          }
        } catch (error) {
         console.error('Failed to fetch CSRF token:', error);
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
    generateTopics: builder.mutation<ApiResponse<GenerateTopicsResponse>, { business: string }>({
      query: (body) => ({
        url: '/topics',
        method: 'POST',
        body,
      }),
    }),
    generateImageContent: builder.mutation<ApiResponse<any>, { topic: string }>({
      query: (body) => ({
        url: '/image-content',
        method: 'POST',
        body,
      }),
    }),
    generateBlog: builder.mutation<ApiResponse<any>, void>({
      query: (topic) => ({
        url: '/generate-blog',
        method: 'POST',
        body: { topic },
      }),
    }),
    savePostContent: builder.mutation<ApiResponse<any>, { topics: string[] }>({
      query: (topics) => ({
        url: '/user/save-topics',
        method: 'POST',
        body: topics,
      }),
    }),
    getPendingPosts: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `/user/get-pending-topics`,
        method: 'GET',
      }),
    }),
    getPostContent: builder.query<ApiResponse<any>, { postContentId: string }>({
      query: ({ postContentId }) => ({
        url: `/user/get-topics/${postContentId}`,
        method: 'GET',
      }),
    }),
    imageContent: builder.mutation<ApiResponse<any>, { postContentId: string; topic: string; templateId: string; content: object; hashtags: [string]; status: string }>({
      query: (body) => ({
        url: '/user/image-content',
        method: 'POST',
        body,
      }),
    }),
    carouselContent: builder.mutation<ApiResponse<any>, { postContentId: string; topic: string; templateId: string; content: any[]; status: string }>({
      query: (body) => ({
        url: '/user/carousel-content',
        method: 'POST',
        body,
      }),
    }),
    dykContent: builder.mutation<ApiResponse<any>, { postContentId: string; topic: string; templateId: string; content: object; hashtags: [string]; status: string }>({
      query: (body) => ({
        url: '/user/dyk-content',
        method: 'POST',
        body,
      }),
    }),
    savePosts: builder.mutation<ApiResponse<any>, SavePostRequest>({
      query: (posts) => ({
        url: '/user/save-posts',
        method: 'POST',
        body: posts,
      }),
    }),
    getSavePosts: builder.query<ApiResponse<any>, { postContentId: string }>({
      query: ({ postContentId }) => ({
        url: `/user/get-posts/${postContentId}`,
        method: 'GET',
      }),
    }),
    getImageContent: builder.query<ApiResponse<any>, { contentId: string }>({
      query: ({ contentId }) => ({
        url: `/user/get-image-content/${contentId}`,
        method: 'GET',
      }),
    }),
    getCarouselContent: builder.query<ApiResponse<any>, { contentId: string }>({
      query: ({ contentId }) => ({
        url: `/user/get-carousel-content/${contentId}`,
        method: 'GET',
      }),
    }),
    getDYKContent: builder.query<ApiResponse<any>, { contentId: string }>({
      query: ({ contentId }) => ({
        url: `/user/get-dyk-content/${contentId}`,
        method: 'GET',
      }),
    }),
    updatePost: builder.mutation<ApiResponse<any>, { contentId: string; contentType: string; images?: { url: string; label: string }[] }>({
      query: ({ contentId, ...body }) => ({
        url: `/user/update-posts/${contentId}`,
        method: 'PUT',
        body,
      }),
    }),
    updatePostTopicStatus: builder.mutation<ApiResponse<any>, { postTopicId: string; status: string }>({
      query: ({ postTopicId, ...body }) => ({
        url: `/user/update-post-topic/${postTopicId}`,
        method: 'PUT',
        body,
      }),
    }),
    getUserAllPosts: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `/user/get-all-posts`,
        method: 'GET',

      }),
    }),
    getUserPostDetail: builder.query<ApiResponse<any>, { postId: string }>({
      query: ({ postId }) => ({
        url: `/user/get-user-post/${postId}`,
        method: 'GET',

      }),
    }),
    generateCode: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/generate-code',
        method: 'POST',
        body: formData
      }),
    }),
    authLinkedIn: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/social/linkedin/auth',
        method: 'GET',
      }),
    }),
    authFacebook: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/social/facebook/auth',
        method: 'GET',
      }),
    }),
    authInstagram: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/social/instagram/auth',
        method: 'GET',
      }),
    }),
    linkedInPost: builder.mutation<ApiResponse<any>, { title: String; description: String, imageUrl: String; scheduleTime: string }>({
      query: (body) => ({
        url: '/social/linkedin/post',
        method: 'POST',
        body
      }),
    }),



  }),
});

export const {
  useLazyGetCsrfTokenQuery,
  useGenerateIdeasMutation,
  useGenerateImageMutation,
  usePostContentMutation,
  useGenerateCarouselMutation,
  useUploadCarouselToCloudinaryMutation,
  useUploadImageToCloudinaryMutation,
  useGenerateDoYouKnowMutation,
  useSignUpMutation,
  useSignInMutation,
  useSignUpAndSigninByProviderMutation,
  useVerifyOTPMutation,
  useGenerateTopicsMutation,
  useGenerateImageContentMutation,
  useSavePostsMutation,
  useGenerateBlogMutation,
  useSavePostContentMutation,
  useLazyGetPostContentQuery,
  useImageContentMutation,
  useCarouselContentMutation,
  useDykContentMutation,
  useLazyGetSavePostsQuery,
  useLazyGetImageContentQuery,
  useLazyGetCarouselContentQuery,
  useLazyGetDYKContentQuery,
  useUpdatePostMutation,
  useResendOTPMutation,
  useForgetPasswordMutation,
  useUserDetailsMutation,
  useLazyGetUserProfileQuery,
  useLazyAuthLinkedInQuery,
  useGenerateCodeMutation,
  useUpdatePostTopicStatusMutation,
  useLazyGetUserAllPostsQuery,
  useLazyGetUserPostDetailQuery,
  useLazyGetPendingPostsQuery,
  useLazyAuthFacebookQuery,
  useLazyAuthInstagramQuery,
  useLinkedInPostMutation,
} = api;