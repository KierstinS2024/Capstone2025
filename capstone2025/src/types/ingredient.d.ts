export interface IngredientBody {
  name: string;
  unit: string;
  defaultQuantity: number;
  nutritionInfo?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
