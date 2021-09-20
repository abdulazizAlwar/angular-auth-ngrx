import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,
  HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { observable, Observable, throwError } from 'rxjs';
import { tap, catchError,  } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService: AuthService = this.injector.get(AuthService);
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | null = this.authService.getToken();
    request = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return next.handle(request);
  }
}
@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((response: any) => {
        if (response instanceof HttpErrorResponse && response.status === 401){
          console.log(response)
          localStorage.removeItem('token')
          this.router.navigateByUrl('/log-in')
        }
        if (response instanceof HttpErrorResponse && response.status === 400){
          console.log(response)
          this.router.navigateByUrl('/status')
        }
        return throwError(response)
      }),
    )
  }
}
