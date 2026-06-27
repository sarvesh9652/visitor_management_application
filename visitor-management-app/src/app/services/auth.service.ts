import { Injectable, signal } from '@angular/core';

type UserRole = 'Security' | 'Resident';
const AUTH_STORAGE_KEY = 'visitor-management-auth-role-v1';
const USER_SESSION_KEY = 'visitor-management-auth-user-v1';
const USER_STORE_KEY = 'visitor-management-user-store-v1';

export interface UserAccount {
  username: string;
  password: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly roleSignal = signal<UserRole | null>(this.loadRole());
  private readonly userSignal = signal<UserAccount | null>(this.loadUser());
  readonly role = this.roleSignal.asReadonly();
  readonly currentUser = this.userSignal.asReadonly();

  get isAuthenticated(): boolean {
    return this.userSignal() !== null;
  }

  get currentRole(): UserRole | null {
    return this.roleSignal();
  }

  login(username: string, password: string): boolean {
    const users = this.loadUsers();
    const user = users.find((item) => item.username === username && item.password === password);

    if (!user) {
      return false;
    }

    this.userSignal.set(user);
    this.roleSignal.set(user.role);
    this.saveUser(user);
    this.saveRole(user.role);
    return true;
  }

  signup(username: string, password: string, role: UserRole): boolean {
    const users = this.loadUsers();
    if (users.some((item) => item.username === username)) {
      return false;
    }

    const user: UserAccount = { username, password, role };
    users.push(user);
    this.saveUsers(users);
    return true;
  }

  logout(): void {
    this.userSignal.set(null);
    this.roleSignal.set(null);
    this.clearUser();
    this.clearRole();
  }

  hasRole(role: UserRole): boolean {
    return this.roleSignal() === role;
  }

  private loadRole(): UserRole | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored === 'Security' || stored === 'Resident' ? stored : null;
  }

  private saveRole(role: UserRole): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, role);
  }

  private clearRole(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  private loadUser(): UserAccount | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = window.localStorage.getItem(USER_SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as UserAccount;
    } catch {
      return null;
    }
  }

  private saveUser(user: UserAccount): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  }

  private clearUser(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(USER_SESSION_KEY);
  }

  private loadUsers(): UserAccount[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const raw = window.localStorage.getItem(USER_STORE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as UserAccount[];
    } catch {
      return [];
    }
  }

  private saveUsers(users: UserAccount[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
  }
}
