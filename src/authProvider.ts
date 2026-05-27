// src/authProvider.js
import type { AuthProvider } from 'react-admin';

const apiUrl = import.meta.env.VITE_API_URL;

export const authProvider: AuthProvider = {
    async login({ username, password }) {
        const request = new Request(`${apiUrl}auth/rlogin`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'include',
        });

        const response = await fetch(request);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const auth = await response.json();

        localStorage.setItem('auth', JSON.stringify(auth));

        return auth;

    },
    async logout() {
        if (localStorage.getItem('auth')) {
            const request = new Request(`${apiUrl}/auth/rlogout`, {
                method: 'GET',
                credentials: 'include',
            });
            await fetch(request);
            localStorage.removeItem('auth');
        }
        //return Promise.resolve();
    },
    async checkError(error) {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            throw new Error('Session expired:' + status);
        }
        
    },
    async checkAuth() {
        if (!localStorage.getItem('auth')) {
            throw new Error('Not authenticated');
        }
    }
   
};