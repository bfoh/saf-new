export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'teacher' | 'admin' | 'superadmin';
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
