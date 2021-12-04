import axios, { AxiosRequestConfig } from "axios";

export const FetcherClient = (prefixUrl: string, options?: AxiosRequestConfig) => axios.create(
    {
        baseURL: prefixUrl, ...options,
    }
);