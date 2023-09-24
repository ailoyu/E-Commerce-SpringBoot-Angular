import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../service/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService) { }

    intercept( // intercept: là xen ngang, chèn thêm cái gì đó vào
        req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        debugger
        const token = this.tokenService.getToken();
        if (token) { // chèn token từ localStorage vào header để duy trì đăng nhập
            req = req.clone({ // clone: nhân bản ra để sửa
                setHeaders: {
                    Authorization: `Bearer ${token}`, // chèn thêm Bearer + token
                },
            });
        }
        // sửa header xong đi tiếp
        return next.handle(req);
    }

}