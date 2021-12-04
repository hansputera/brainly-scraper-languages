import axios, { AxiosRequestConfig } from "axios";
import { name as PkgName, version as PkgVersion } from "../../package.json";

export const FetcherClient = (prefixUrl: string, options?: AxiosRequestConfig) => axios.create(
    {
        baseURL: prefixUrl, ...options,
    }
);

export const CheckLatestVersion = () => {
    const client = FetcherClient('https://registry.npmjs.com/');
    client.get(PkgName).then((response) => {
        if (JSON.parse(response.data)['dist-tags'].latest !== PkgVersion) {
            console.log('You are running outdated version, please update your brainly-scraper-v2!\nLatest version: ' + JSON.parse(response.data)['dist-tags'].latest);
        } else {
            console.log('You are running latest version from brainly-scraper-v2!');
        }
    }).catch(() => {});  
};