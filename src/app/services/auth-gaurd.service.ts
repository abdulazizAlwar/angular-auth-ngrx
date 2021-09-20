import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, selectAuthState } from '../store/app.states';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService {

  isAuthenticated = false

  constructor(
    public auth: AuthService,
    private store: Store<AppState>,
    public router: Router
  ) {
      this.store.select(selectAuthState).subscribe((state: any) => {
        this.isAuthenticated = state.isAuthenticated;
      });

  }


  canActivate(): boolean {
      if (!this.auth.getToken() && !this.isAuthenticated) {
        this.router.navigateByUrl('/log-in')
        return false
      }
      return true
    }
}
