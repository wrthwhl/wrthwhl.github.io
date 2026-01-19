'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://analytics.wrthwhl.cloud';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register'];

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      // Skip check for public routes
      if (PUBLIC_ROUTES.includes(pathname)) {
        setState({ isLoading: false, isAuthenticated: false });
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/session`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (data.authenticated) {
          setState({ isLoading: false, isAuthenticated: true });
        } else {
          // Redirect to login
          router.replace('/login');
        }
      } catch {
        // On error, redirect to login
        router.replace('/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  return state;
}
