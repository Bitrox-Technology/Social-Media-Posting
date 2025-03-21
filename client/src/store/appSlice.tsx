import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

// Define a serializable type for selectedFile
interface SelectedFileData {
  name: string;
  url: string; // Cloudinary URL or similar
}

interface AppState {
  contentType: 'post' | 'reel' | null;
  selectedTopic: string;
  selectedIdea: ContentIdea | null;
  selectedFile: SelectedFileData | null; // Updated to serializable type
  posted: string[];
  ideas: ContentIdea[];
}

const initialState: AppState = {
  contentType: null,
  selectedTopic: '',
  selectedIdea: null,
  selectedFile: null,
  posted: [],
  ideas: [],
};

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
    setSelectedFile(state, action: PayloadAction<SelectedFileData | null>) {
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

export const { setContentType, setSelectedTopic, setSelectedIdea, setSelectedFile, setPosted, setIdeas, resetState } =
  appSlice.actions;

export default appSlice.reducer;