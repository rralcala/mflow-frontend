// src/httpClient.js
import { fetchUtils } from 'react-admin';

export const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // This allows the browser to send/receive cookies (session IDs)
    options.user = { authenticated: true };
    options.credentials = 'include';
    return fetchUtils.fetchJson(url, options);
};