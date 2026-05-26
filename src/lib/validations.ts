import zod from "zod";

export const registerSchema = zod.object({
    first_name: zod.string().trim().min(1, "First name is required"),
    last_name: zod.string().trim().min(1, "Last name is required"),
    email: zod.string().email("Invalid email address"),
    password: zod.string().min(8, "Password must be at least 8 characters long"),
})

export const loginSchema = zod.object({
    email: zod.string().email("Invalid email address"),
    password: zod.string().min(1, "Password is required"),
})

export const mealSchema = zod.object({
    dish_name: zod.string().trim().min(1, "Dish name is required"),
    servings: zod.coerce.number().positive("Servings must be greater than 0"),
})

export type RegisterFormValues = zod.infer<typeof registerSchema>;
export type LoginFormValues = zod.infer<typeof loginSchema>;
export type MealFormValues = zod.input<typeof mealSchema>;
export type ParsedMealFormValues = zod.infer<typeof mealSchema>;
