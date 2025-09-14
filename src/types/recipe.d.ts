export interface Recipe {
  id: string;
  title: string;
  image?: string;
  summary?: string;
  instructions?: string;
  ingredients?: { name: string; quantity?: string }[];
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  favorite?: boolean;
}
