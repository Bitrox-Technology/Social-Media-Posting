import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the ContentIdea interface (if not imported from another file)
interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

// Define the AppState interface for the Redux store
interface AppState {
  contentType: 'post' | 'reel' | null; // Selected content type (post or reel)
  selectedTopic: string; // Selected topic for content ideas
  selectedIdea: ContentIdea | null; // Selected idea (updated to ContentIdea | null)
  selectedFile: File | null; // Selected file for image generation
  posted: string[]; // List of platforms where the content has been posted
  ideas: ContentIdea[]; // List of generated content ideas
}

// Define the initial state
const initialState: AppState = {
  contentType: null,
  selectedTopic: '',
  selectedIdea: null, // Updated to null instead of ''
  selectedFile: null,
  posted: [],
  ideas: [],
};

// Create the app slice with reducers
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setContentType(state, action: PayloadAction<'post' | 'reel' | null>) {
      state.contentType = action.payload;
    },
    setSelectedTopic(state, action: PayloadAction<string>) {
      state.selectedTopic = action.payload;
    },
    setSelectedIdea(state, action: PayloadAction<ContentIdea | null>) {
      state.selectedIdea = action.payload;
    },
    setSelectedFile(state, action: PayloadAction<File | null>) {
      state.selectedFile = action.payload;
    },
    setPosted(state, action: PayloadAction<string[]>) {
      state.posted = action.payload;
    },
    setIdeas(state, action: PayloadAction<ContentIdea[]>) {
      state.ideas = action.payload;
    },
    resetState(state) {
      state.contentType = null;
      state.selectedTopic = '';
      state.selectedIdea = null;
      state.selectedFile = null;
      state.posted = [];
      state.ideas = [];
    },
  },
});

// Export the actions
export const { setContentType, setSelectedTopic, setSelectedIdea, setSelectedFile, setPosted, setIdeas, resetState } = appSlice.actions;

// Export the reducer
export default appSlice.reducer;