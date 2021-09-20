import { GetStatus } from './../actions/auth.actions';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import {
  AuthActionTypes,
  LogIn, LogInSuccess, LogInFailure,
  SignUp, SignUpSuccess, SignUpFailure,
  LogOut
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

  SignUp: Observable<any> = createEffect(() =>
  this.actions.pipe(
    ofType(AuthActionTypes.SIGNUP),
    map((action: SignUp) => action.payload),
    switchMap(payload => {

      return this.authService.register(payload.email, payload.password).pipe(
        map((user: any) => {
          console.log(user);
          return new SignUpSuccess({ token: user.token, email: payload.email });
        })
      )

    }),
    catchError(error => {
      console.log(error);
      return of(new SignUpFailure({ error: error }))
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

  LogOut: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.LOGOUT),
      tap((user: any) => {
        localStorage.removeItem('token');
      })
    ), { dispatch: false }
  )

  SignUpSuccess: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.SIGNUP_SUCCESS),
      tap((user: any) => {
        localStorage.setItem('token', user.payload.token);
        this.router.navigateByUrl('/');
      })
    ), { dispatch: false }
  )

  //   AuthFailure: Observable<any> = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(AuthActionTypes.LOGIN_FAILURE, AuthActionTypes.SIGNUP_FAILURE)
  //   ), { dispatch: false }
  // )

  LogInFailure: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.LOGIN_FAILURE)
    ), { dispatch: false }
  )

  SignUpFailure: Observable<any> = createEffect(() =>
    this.actions.pipe(
      ofType(AuthActionTypes.SIGNUP_FAILURE),
    ), { dispatch: false }
  )

  GetStatus: Observable<any> = createEffect(() =>
  this.actions.pipe(
    ofType(AuthActionTypes.GET_STATUS),
    map((action: GetStatus) => action),
    switchMap(payload => {
      return this.authService.getStatus()
    })
  ), { dispatch: false }
)

// GetStatus: Observable<any> = createEffect(() =>
// this.actions.pipe(
//   ofType(AuthActionTypes.GET_STATUS),
//   switchMap(payload => {
//     return this.authService.getStatus()
//   })
// ), { dispatch: false }
// )

}
