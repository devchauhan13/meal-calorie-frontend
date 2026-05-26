import {
    AuthResponse,
    RegisterPayload,
    LoginPayload,
    MealLookupPayload,
    CalorieResponse,
    RateLimitMeta

} from "@/types";


const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://xpcc.devb.zeak.io/api").replace(
    /\/$/,
    "",
);

export class ApiError extends Error {
    status!: number;
    retryAfter?: number;
    rateLimit?: RateLimitMeta;
}

function parseRateLimitHeaders(headers: Headers): RateLimitMeta {
    const limit = headers.get("RateLimit-Limit");
    const remaining = headers.get("RateLimit-Remaining");
    const reset = headers.get("RateLimit-Reset");

    return {
        limit: limit ? Number(limit) : undefined,
        remaining: remaining ? Number(remaining) : undefined,
        reset: reset ?? undefined,
    };
}

async function apiFetch<T>({
    path,
    method,
    body,
    token
}: {
    path: string;
    method: 'GET' | 'POST';
    body?: unknown;
    token?: string;
}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && {
                Authorization: `Bearer ${token}`,
            })
        },
        ...(body
            ? { body: JSON.stringify(body) }
            : {})
    });

    const rateLimit = parseRateLimitHeaders(response.headers);
    let data;
    try {
        data = await response.json();
    } catch {
        data = null
    }

    if (!response.ok) {
        const error = new ApiError(data?.message || "API request failed");

        error.status = response.status;
        error.retryAfter = data?.retryAfter;
        error.rateLimit = rateLimit;

        switch (response.status) {
            case 400:
                error.message = data?.message || "Invalid request. Please check your input.";
                break;

            case 401:
                error.message = data?.message || "Invalid email or password.";
                break;

            case 403:
                error.message = "Session expired. Please login again.";
                localStorage.removeItem("auth-storage");

                const { useAuthStore } = await import("@/stores/authStore");
                useAuthStore.getState().logout();

                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                break;

            case 404:
                error.message = data?.message || "Resource not found.";
                break;

            case 409:
                error.message = data?.message || "This account already exists.";
                break;

            case 422:
                error.message = data?.message || "Unable to process this request.";
                break;

            case 429:
                error.message = data?.message || "Too many requests. Please try again later.";
                break;

            case 500:
                error.message = "Something went wrong on the server. Please try again later.";
                break;

            default:
                error.message = data?.message || "Unexpected API error occurred.";
        }

        throw error;
    }
    return data as T
};


export async function registerUser(payload: RegisterPayload) {
    return apiFetch<AuthResponse>({ path: '/auth/register', method: 'POST', body: payload });
}

export async function loginUser(payload: LoginPayload) {
    return apiFetch<AuthResponse>({ path: '/auth/login', method: 'POST', body: payload });
}

export async function getCalories(payload: MealLookupPayload, token: string) {
    return apiFetch<CalorieResponse>({ path: '/get-calories', method: 'POST', body: payload, token });
}