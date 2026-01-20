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

  // derive role from persona string
  if (user.persona === 'Administrator') {
    this.role = 'ADMIN';
  } else if (user.persona === 'Finance Specialist') {
    this.role = 'FINANCE';
  }

  if (this.isBrowser()) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}


  getUser(): UserInfo | null {
    if (this.currentUser) return this.currentUser; 
    if (this.isBrowser()) { 
        const stored = localStorage.getItem('user'); 
        if (stored) this.currentUser = JSON.parse(stored); 
    } 
    return this.currentUser;
  }

  clearUser() {
    this.currentUser = null;
    if (this.isBrowser()) {
         localStorage.removeItem('user'); 
    }
  }


  
  private role: 'ADMIN' | 'FINANCE' | null = null;

  setRole(role: 'ADMIN' | 'FINANCE') {
    this.role = role;
  }

  getRole(): 'ADMIN' | 'FINANCE' | null {
    return this.role;
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  isFinance(): boolean {
    return this.role === 'FINANCE';
  }


}
