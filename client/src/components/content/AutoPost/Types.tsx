import { FlashSaleSlide } from "../../../templetes/Product/flashSaleTemplates";
import { NewProductSlide } from "../../../templetes/Product/newProductTemplates";
import { OfferSlide } from "../../../templetes/Product/offerDiscountTemplates";

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
    hashtags?: [];
  }
  
  export interface Slide {
    tagline?: string;
    title: string;
    description: string;
    [key: string]: any;
  }
  
  export interface Post {
    topic: string;
    type: 'image' | 'carousel' | 'doyouknow' | 'festival' | 'product';
    content: ImageContent | DoYouKnowContent | Slide[] | string | NewProductSlide | OfferSlide | FlashSaleSlide ;
    images?: { url: string; label: string }[];
    templateId?: string;
    status: 'pending' | 'success' | 'error' | 'generating';
    errorMessage?: string;
    contentId?: string;
    contentType?: 'ImageContent' | 'CarouselContent' | 'DoyouknowContent' | 'FestivalContent' | 'ProductContent';
    postId?:string
  }