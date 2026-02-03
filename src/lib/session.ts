import { User } from '@/types';

const SESSION_KEY = 'kord_user_session';

export interface Session {
  user: User;
  timestamp: number;
}

export function setSession(user: User): void {
  if (typeof window !== 'undefined') {
    const session: Session = {
      user,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export function getSession(): Session | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(SESSION_KEY);
    if (data) {
      return JSON.parse(data);
    }
  }
  return null;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function isAuthenticated(): boolean {
  const session = getSession();
  return !!session?.user?.id;
}

export function getCurrentUser(): User | null {
  const session = getSession();
  return session?.user || null;
}

export function getCurrentUserId(): string | null {
  const user = getCurrentUser();
  return user?.id || null;
}
