import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../environments/environment';
import { UpdateUserDTO } from '../dtos/user/update.dto';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private createHeaders(): HttpHeaders{
    return new HttpHeaders({
      'Content-Type' : 'application/json',
      'Accept-Language' : 'vi'
    });
  }

  private apiConfig = {
    headers: this.createHeaders(),
  }
  
  // Gọi api register
  private apiRegister = `${environment.apiBaseUrl}/users/register`;

  

  register(registerDTO: RegisterDTO):Observable<any>{
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }

  // Gọi api login
  private apiLogin = `${environment.apiBaseUrl}/users/login`;


  login(loginDTO: any): Observable<any>{
    debugger
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }


  // Gọi api update user
  private apiUpdateUser = `${environment.apiBaseUrl}/users/update`;

  updateUser(updateUserDTO: any): Observable<any>{
    debugger
    return this.http.put(this.apiUpdateUser, updateUserDTO, this.apiConfig);
  }


  // Gọi api change password
  private apiChangePassword = `${environment.apiBaseUrl}/users/change-password`;

  changePassword(loginUserDTO: LoginDTO): Observable<any>{
    debugger
    return this.http.post(this.apiChangePassword, loginUserDTO, this.apiConfig);
  }
  



}
