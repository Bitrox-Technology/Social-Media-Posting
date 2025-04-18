import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser, clearUser } from './appSlice'; // Adjust path to your appSlice

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

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/api/v1',
    prepareHeaders: (headers, { getState }: { getState: () => unknown }) => {
      const dispatch = (action: any) => {}; // Add a placeholder dispatch function if needed
      const state = getState() as { app?: { user?: { token?: string; expiresAt?: number; email?: string } } };
      let token = state.app?.user?.token;

      // Fallback to localStorage if token is not in state
      if (!token) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          token = user.token;
          const expiresAt = user.expiresAt;

          // Check if token is expired
          if (expiresAt && Date.now() > expiresAt) {
            dispatch(clearUser());
            localStorage.removeItem('user');
            window.location.href = '/signin';
            return headers;
          }

          // Restore user to Redux
          dispatch(setUser(user));
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
    uploadCarousel: builder.mutation<ApiResponse<any>, FormData>({
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
    generateDoYouKnow: builder.mutation<ApiResponse<GenerateDoYouKnowResponse>, { topic: string }>({
      query: (body) => ({
        url: '/generate-doyouknow',
        method: 'POST',
        body,
      }),
    }),
    signUp: builder.mutation<ApiResponse<any>, { email: string; password: string }>({
      query: (body) => ({
        url: '/user/signup',
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
          dispatch(setUser(userData));

          // Store in localStorage
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Sign-in failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),
    generateTopics: builder.mutation<ApiResponse<GenerateTopicsResponse>, { business: string }>({
      query: (body) => ({
        url: '/topics',
        method: 'POST',
        body,
      }),
    }),
    generateImageContent: builder.mutation<{ data: { title: string; description: string } }, { topic: string }>({
      query: (body) => ({
        url: '/image-content',
        method: 'POST',
        body,
      }),
    }),
    generateBlog: builder.mutation({
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
    getPostContent: builder.query<ApiResponse<any>, { postContentId: string }>({
      query: ({ postContentId }) => ({
        url: `/user/get-topics/${postContentId}`,
        method: 'GET',
      }),
    }),
    imageContent: builder.mutation<ApiResponse<any>, { postContentId: string; topic: string; templateId: string; content: object; status: string }>({
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
    dykContent: builder.mutation<ApiResponse<any>, { postContentId: string; topic: string; templateId: string; content: object; status: string }>({
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
  }),
});

export const {
  useGenerateIdeasMutation,
  useGenerateImageMutation,
  usePostContentMutation,
  useGenerateCarouselMutation,
  useUploadCarouselMutation,
  useUploadImageToCloudinaryMutation,
  useGenerateDoYouKnowMutation,
  useSignUpMutation,
  useSignInMutation,
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
} = api;