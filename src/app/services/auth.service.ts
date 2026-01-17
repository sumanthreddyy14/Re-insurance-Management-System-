// auth.service.ts
import { Injectable } from '@angular/core';

export interface UserInfo {
  userId: string;
  persona: string;
  lastLogin: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: UserInfo | null = null;

  private isBrowser(): boolean {
     return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'; 
    }

  setUser(user: UserInfo) {
    this.currentUser = user;
    // optionally persist in localStorage
    // localStorage.setItem('user', JSON.stringify(user));
    if (this.isBrowser()) {
         localStorage.setItem('user', JSON.stringify(user)); 
    }
  }

  getUser(): UserInfo | null {
    // if (!this.currentUser) {
    //   const stored = localStorage.getItem('user');
    //   if (stored) this.currentUser = JSON.parse(stored);
    // }
    // return this.currentUser;
    if (this.currentUser) return this.currentUser; 
    if (this.isBrowser()) { 
        const stored = localStorage.getItem('user'); 
        if (stored) this.currentUser = JSON.parse(stored); 
    } 
    return this.currentUser;
  }

  clearUser() {
    this.currentUser = null;
    // localStorage.removeItem('user');
    if (this.isBrowser()) {
         localStorage.removeItem('user'); 
    }
  }
}
