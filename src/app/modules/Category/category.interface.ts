export type TCategoryType = 'essential' | 'non-essential' | 'debt';

export interface ICategory {
  _id?: string;
  name: string;
  type: TCategoryType;
  icon?: string; // optional icon string (e.g., 'home', 'bag', etc.)
  parentCategory?: string | null; // for collapsible structure
  yearlyActual?: number;
  yearlyForecast?: number;
  fiveYearForecast?: number;
  isCustom?: boolean; // whether the category was created by the user
  createdAt?: Date;
  updatedAt?: Date;
}
