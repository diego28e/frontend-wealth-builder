import {apiClient} from '../lib/api';
import type {LoginRequest, RegisterRequest, AuthResponse} from '../types/api';

export const authService = {
    async login(credentials:LoginRequest): Promise<AuthResponse> {
        return apiClient<AuthResponse>('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },
    async register(data:RegisterRequest): Promise<AuthResponse> {
        return apiClient<AuthResponse>('/register', {
            method:'POST',
            body:JSON.stringify(data),
        });
    },
    async logout(): Promise<void> {
        await apiClient('/logout', {
            method:'POST',
        });
    },
    async getMe(): Promise<AuthResponse> {
        return apiClient<AuthResponse>('/me', {
            method: 'GET',
        });
    },
    async refreshToken(): Promise<void> {
        await apiClient('/refresh-token',{
            method:'POST',
        })
    }
}