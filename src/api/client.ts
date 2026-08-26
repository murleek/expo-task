const BASE_URL = "https://dummyjson.com";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | undefined>;
};

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(BASE_URL + path);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function apiClient<T>(
  path: string,
  { method = "GET", body, params }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request failed: ${response.status} ${path}`,
    );
  }

  return response.json() as Promise<T>;
}

export const http = {
  get: <T>(
    path: string,
    params?: Record<string, string | number | undefined>,
  ) => apiClient<T>(path, { method: "GET", params }),
  post: <T>(path: string, body: unknown) =>
    apiClient<T>(path, { method: "POST", body: body }),
  put: <T>(path: string, body: unknown) =>
    apiClient<T>(path, { method: "PUT", body: body }),
  delete: <T>(path: string) => apiClient<T>(path, { method: "DELETE" }),
};

export { ApiError };
