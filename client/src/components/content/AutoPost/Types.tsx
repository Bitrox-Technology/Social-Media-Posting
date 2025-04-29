export interface ImageContent {
    title: string;
    description: string;
    footer?: string;
    websiteUrl?: string;
    imageUrl: string;
  }
  
  export interface DoYouKnowContent {
    title: string;
    fact: string;
    footer?: string;
    websiteUrl?: string;
    imageUrl?: string;
  }
  
  export interface CarouselContent {
    tagline?: string;
    title: string;
    description?: string;
    imageUrl?: string;
  }
  
  export interface Slide {
    tagline?: string;
    title: string;
    description: string;
    [key: string]: any;
  }
  
  export interface Post {
    topic: string;
    type: 'image' | 'carousel' | 'doyouknow';
    content: ImageContent | DoYouKnowContent | Slide[] | string;
    images?: { url: string; label: string }[];
    templateId?: string;
    status: 'pending' | 'success' | 'error';
    errorMessage?: string;
    contentId?: string;
    contentType?: 'ImageContent' | 'CarouselContent' | 'DoyouknowContent';
  }