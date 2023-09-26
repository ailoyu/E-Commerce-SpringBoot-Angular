import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../service/user.service';
import { TokenService } from '../service/token.service';
import { LoginResponse } from '../responses/user/login.response';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private userService: UserService,
    private tokenService: TokenService,
    private router: Router) {}

    loginResponse!: LoginResponse | null;

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean> | Promise<boolean> | boolean {
        const userInformation = this.tokenService.displayUserInformation();

        // nếu mà ko có thông tin user, thì chuyển về trang login
        if (userInformation) {
        return userInformation.pipe(
            map(response => {
            this.loginResponse = { ...response };
            if (this.loginResponse.role_id === 2) {
                return true;
            } else {
                this.router.navigate(['/home']);
                return false;
            }
            }),
            catchError(() => {
            this.router.navigate(['/login']);
            return of(false);
            })
        );
        } else {
        this.router.navigate(['/login']);
        return false;
        }
      }
}