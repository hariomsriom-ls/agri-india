import axios, { type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials:true,
});

type RetryableRequest = InternalAxiosRequestConfig & { sessionRetried?: boolean };
let landownerRefresh: Promise<unknown> | null = null;

api.interceptors.response.use(response => response, async (error: unknown) => {
  if (!axios.isAxiosError(error)) return Promise.reject(error);
  const request = error.config as RetryableRequest | undefined;
  const path = request?.url?.split("?")[0];
  const isProtectedLandownerRequest = path?.startsWith("/landowner/") &&
    !["/landowner/loginlandowner", "/landowner/registerlandowner", "/landowner/logout", "/landowner/refresh-access-token"].includes(path);

  if (error.response?.status !== 401 || !request || request.sessionRetried || !isProtectedLandownerRequest) {
    return Promise.reject(error);
  }
  request.sessionRetried = true;
  try {
    if (!landownerRefresh) {
      landownerRefresh = api.post("/landowner/refresh-access-token", {}).finally(() => {
        landownerRefresh = null;
      });
    }
    await landownerRefresh;
  } catch (refreshError) {
    return Promise.reject(refreshError);
  }
  request.headers.delete("Authorization");
  return api.request(request);
});

export default api;
