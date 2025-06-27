import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { set } from 'lodash';

interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

interface SelectedFileData {
  name: string;
  url: string;
}

interface CarouselContent {
  tagline?: string;
  title: string;
  description?: string;
}

interface DoYouKnowContent {
  title: string;
  description: string;
}

interface Post {
  topic: string;
  type: 'image' | 'carousel' | 'doyouknow';
  content: string | CarouselContent[] | DoYouKnowContent;
  images?: string[];
  templateId?: string;
}

interface User {
  userName?: string;
  email?: string;
  phone?: string;
  logo?: string;
  expiresAt?: number;
  role?: string;
  authenticate?: boolean;
  sessionValid?: boolean;
}

interface CsrfState {
  token?: string;
  expiresAt?: number;
}

interface BlogContent {
  title: string;
    content: string;
    metaDescription: string;
    categories: string[];
    tags: string[];
    excerpt?: string; 
    focusKeyword?: string; 
    slug: string;
    image: { 
      url: string;
      altText: string; 
      description?: string }
}
interface AppState {
  contentType: 'topic' | 'blog' | 'carousel' | 'doyouknow' | 'promotional' | 'informative' | 'engagement' | 'brand' | 'event' | 'testimonial' | 'festivals' |null;
  selectedTopic: string;
  selectedIdea: ContentIdea | null;
  selectedFile: SelectedFileData | null;
  posted: string[];
  ideas: ContentIdea[];
  selectedDoYouKnowTemplate: string | null;
  selectedBusiness: string | null;
  posts: Post[];
  apiTopics: string[];
  customTopics: string[];
  user?: User;
  blogContent?: BlogContent;
  csrfToken?: string;
  csrfTokenExpiresAt?: number;
  isAuthenticated: boolean;
  sessionWarning: boolean;
  sessionWarningToExpire? : boolean;
}

const initialState: AppState = {
  contentType: null,
  selectedTopic: '',
  selectedIdea: null,
  selectedFile: null,
  posted: [],
  ideas: [],
  selectedDoYouKnowTemplate: null,
  selectedBusiness: null,
  posts: [],
  apiTopics: [],
  customTopics: [],
  user: undefined,
  csrfToken: undefined,
  csrfTokenExpiresAt: undefined,
  isAuthenticated: false,
  sessionWarning: false,
  sessionWarningToExpire: false,
  blogContent: undefined,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setContentType(
      state,
      action: PayloadAction<'topic' | 'blog' | 'carousel' | 'doyouknow' | 'promotional' | 'informative' | 'engagement' | 'brand' | 'event' | 'testimonial' | 'festivals' | null>
    ) {
      state.contentType = action.payload;
    },
    setSelectedTopic(state, action: PayloadAction<string>) {
      state.selectedTopic = action.payload;
    },
    setSelectedBusiness: (state, action: PayloadAction<string>) => {
      state.selectedBusiness = action.payload;
    },
    setSelectedIdea(state, action: PayloadAction<ContentIdea | null>) {
      state.selectedIdea = action.payload;
    },
    addCustomTopic(state, action: PayloadAction<string>) {
      if (!state.customTopics.includes(action.payload)) {
        state.customTopics.push(action.payload);
      }
    },
    clearCustomTopics(state) {
      state.customTopics = [];
    },
    setBlogContent(state, action: PayloadAction<BlogContent>) {
      state.blogContent = action.payload;
    },
    setSelectedFile(state, action: PayloadAction<SelectedFileData | null>) {
      state.selectedFile = action.payload;
    },
    setPosted(state, action: PayloadAction<string[]>) {
      state.posted = action.payload;
    },
    setIdeas(state, action: PayloadAction<ContentIdea[]>) {
      state.ideas = action.payload;
    },
    setSelectedDoYouKnowTemplate(state, action: PayloadAction<string | null>) {
      state.selectedDoYouKnowTemplate = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.sessionWarning = false;
    },
    clearUser: (state) => {
      state.user = undefined;
      state.isAuthenticated = false;
      state.sessionWarning = false;
    },
   

    setCsrfToken: (state, action: PayloadAction<CsrfState>) => {
      state.csrfToken = action.payload.token;
      state.csrfTokenExpiresAt = action.payload.expiresAt;
    },
    clearCsrfToken: (state) => {
      state.csrfToken = undefined;
      state.csrfTokenExpiresAt = undefined;
    },
    setSessionWarning: (state, action: PayloadAction<boolean>) => {
      state.sessionWarning = action.payload;
    },
    setSessionWarningToExpire: (state, action: PayloadAction<boolean>) => {
      state.sessionWarningToExpire = action.payload;
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    setApiTopics: (state, action: PayloadAction<string[]>) => {
      state.apiTopics = action.payload;
    },
    resetState(state) {
      state.contentType = null;
      state.selectedTopic = '';
      state.selectedIdea = null;
      state.selectedFile = null;
      state.posted = [];
      state.ideas = [];
      state.selectedDoYouKnowTemplate = null;
    },
  },
});

export const {
  setContentType,
  setSelectedTopic,
  setBlogContent,
  setSelectedIdea,
  setSelectedFile,
  setPosted,
  setIdeas,
  setSelectedDoYouKnowTemplate,
  resetState,
  setUser,
  clearUser,
  setSelectedBusiness,
  setPosts,
  setApiTopics,
  addCustomTopic,
  clearCustomTopics,
  setCsrfToken,
  clearCsrfToken,
  setSessionWarning,
  setSessionWarningToExpire
} = appSlice.actions;
export const selectUser = (state: RootState) => (state.app as AppState).user;
export const selectBlogContent = (state: RootState) => (state.app as AppState).blogContent;
export const selectIsAuthenticated = (state: RootState) => !!state.app.user?.authenticate;
export const selectSessionWarning = (state: RootState) => state.app.sessionWarning;
export default appSlice.reducer;