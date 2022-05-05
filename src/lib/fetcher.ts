import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

/**
 * Create axios request client.
 * @param {string} prefixUrl Request base url.
 * @param {AxiosRequestOptions?} options Axios request options.
 * @return {AxiosInstance}
 */
export const fetcherClient = (
	prefixUrl: string,
	options?: AxiosRequestConfig,
): AxiosInstance =>
	axios.create({
		baseURL: prefixUrl,
		...options,
	});
