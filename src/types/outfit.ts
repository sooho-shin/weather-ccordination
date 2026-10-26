import { Gender, TemperatureBandId, WeatherState } from './weather';

export type OutfitItemCategory = 'outer' | 'top' | 'bottom' | 'shoes' | 'accessory';

export type TpoCategory = 'office' | 'daily' | 'street';

export interface OutfitItem {
  id: string;
  category: OutfitItemCategory;
  name: string;
  iconName: string; // Expo vector icon name (e.g. Ionicons / MaterialCommunityIcons)
  description?: string;
}

export interface OutfitLookbook {
  id: string;
  gender: Gender;
  tempBand: TemperatureBandId;
  weatherState: WeatherState;
  tpo?: TpoCategory;
  weatherDefenseTags?: string[];
  styleTitle: string;
  styleDescription: string;
  imageUrl: any;
  items: OutfitItem[];
  imageSource: 'preset' | 'ai';
  generatedAt?: string;
}

export interface AIOutfitGenerationRequest {
  gender: Gender;
  temperature: number;
  weatherState: WeatherState;
  tpo?: TpoCategory;
  precipitation?: number;
  styleMood?: string; // e.g., '캐주얼', '모던 미니멀', '스트릿', '포멀'
}

export interface AIOutfitGenerationResponse {
  success: boolean;
  lookbook?: OutfitLookbook;
  errorMessage?: string;
  isFallback: boolean;
}
