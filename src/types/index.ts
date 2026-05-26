export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface AuthResponse {
    message: string,
    token: string,
    user: User
}

export interface RegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface MealLookupPayload {
    dish_name: string;
    servings: number;
}

export interface Macronutrients {
    protein?: number;
    total_fat?: number;
    carbohydrates?: number;
    fiber?: number;
    sugars?: number;
    saturated_fat?: number;
}

export interface IngredientBreakdownItem {
    name: string;
    calories_per_100g: number;
    macronutrients_per_100g: Macronutrients;
    serving_size: string;
    data_type: string;
    fdc_id: number;
}

export interface MatchedFood {
    name: string;
    fdc_id: number;
    data_type: string;
    published_date?: string;
}


export interface CalorieResponse {
    dish_name: string;
    servings: number;
    calories_per_serving: number;
    total_calories: number;
    macronutrients_per_serving: Macronutrients;
    total_macronutrients: Macronutrients;
    source: string;
    ingredient_breakdown: IngredientBreakdownItem[];
    matched_food?: MatchedFood;
}

export interface RateLimitMeta {
    limit?: number;
    remaining?: number;
    reset?: string;
    retryAfter?: number;
}

export interface ApiErrorResponse {
    error?: string;
    message?: string;
    status_code?: number;
    retryAfter?: number;
}

export interface MealHistoryItem {
    id: string;
    searchedAt: string;
    query: MealLookupPayload;
    result: CalorieResponse;
}
