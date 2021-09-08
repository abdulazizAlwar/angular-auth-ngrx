import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/operator/catch';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import {
  AuthActionTypes,
  LogIn, LogInSuccess, LogInFailure,
} from '../actions/auth.actions';

@Injectable()
export class AuthEffects {

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private router: Router,
  ) { }

  LogIn: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.LOGIN),
      map((action: LogIn) => action.payload),

      switchMap(payload => {
        return this.authService.logIn(payload.email, payload.password).pipe(
          map((user: any) => {
            console.log(user);
            return new LogInSuccess({ token: user.token, email: payload.email });
          })
        )
      }),
      catchError(error => {
        console.log(error)
        return of(new LogInFailure({ error: error }))
      })

    )
  )

  LogInSuccess: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.LOGIN_SUCCESS),
      tap((user: any) => {
        localStorage.setItem('token', user.payload.token);
        this.router.navigateByUrl('/');
      })
    ), { dispatch: false }
    )

  LogInFailure: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.LOGIN_FAILURE)
    ), { dispatch: false }
    )

}
