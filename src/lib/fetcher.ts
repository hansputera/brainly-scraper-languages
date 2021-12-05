import axios, {AxiosRequestConfig} from 'axios';

export const fetcherClient = (
    prefixUrl: string, options?: AxiosRequestConfig,
) => axios.create(
    {
      baseURL: prefixUrl, ...options,
    },
);
