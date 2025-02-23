export const config = {
    FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
    GITHUB_REDIRECT_URI: 'http://localhost:5000/auth/callback'
} as const;
