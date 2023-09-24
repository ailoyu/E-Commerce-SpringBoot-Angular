import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { LoginResponse } from "../responses/user/login.response";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })


export class TokenService {
    private readonly TOKEN_KEY = 'access_token';
    constructor(private http: HttpClient){}
    
    // getter
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // setter
    setToken(token : string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }


    getPhoneNumberFromToken(token : string | null): any {
        if (token) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse(window.atob(base64));
        }
        return null;
      }
      
      

      getUserByPhoneNumber(phoneNumber: string): Observable<LoginResponse> | null {
        // debugger
        const token = this.getToken();
        
        if (token) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          const url = `${environment.apiBaseUrl}/users/${phoneNumber}`;
    
          return this.http.get<LoginResponse>(url, { headers });
        }
        return null;
      }

    userFromToken: any;
      
      public displayUserInformation(): Observable<LoginResponse> | null {
        const token: string = this.getToken() || '';
      
        if (token.length !== 0) {
          // Đăng nhập
          console.log(token);
          // this.userFromToken = this.getPhoneNumberFromToken(token);
          // const phoneNumber = this.userFromToken.phoneNumber;
      
          return this.getUserByPhoneNumber(this.getPhoneNumberFromToken(token).phoneNumber);
        } else {
          // Chưa đăng nhập
          return null; // Replace null with an appropriate default value or handle the case accordingly
        }
      }
    
    

}