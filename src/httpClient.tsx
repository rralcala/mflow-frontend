// src/httpClient.ts
import { fetchUtils } from 'react-admin';

const apiUrl = import.meta.env.VITE_API_URL;

export const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // This allows the browser to send/receive cookies (session IDs)
    options.user = { authenticated: true };
    options.credentials = 'include';
    return fetchUtils.fetchJson(url, options);
};

export function fetcherEffect(setData, setError, setLoading, route) {

    return () => {
        const user = { authenticated: true };
        fetchUtils.fetchJson(apiUrl + route, { user, credentials: 'include' })
            .then(response => setData(response.json))
            .catch(error => setError(error))
            .finally(() => setLoading(false));

    }
}