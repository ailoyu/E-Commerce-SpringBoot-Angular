import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginDTO } from 'src/app/dtos/user/login.dto';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  currentPassword!: string;
  newPassword!: string;
  confirmPassword!: string;

  orderForm: FormGroup; //Dùng orderForm để validate dữ liệu nhập


  constructor(private fb: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService){
    this.orderForm = this.fb.group({
      currentPassword: ['', Validators.required], 
      newPassword: ['', Validators.required],     
      confirmNewPassword: ['', [Validators.required, this.passwordMatchValidator]], 
      
    }, { validator: this.passwordMatchValidator });
  }


  loginResponse$!: Observable<LoginResponse> | null;
  loginResponse!: LoginResponse | null;

  changePassword() {
    this.tokenService.displayUserInformation()?.subscribe(response => {
      this.loginResponse = { ...response };
      debugger
      console.log(this.loginResponse);
      
      const loginDTO: LoginDTO = {
        "phone_number" : this.loginResponse.phone_number,
        "password" : this.currentPassword,
        "role_id": this.loginResponse.role_id,
        "new_password": this.newPassword,
        "confirm_new_password" : this.confirmPassword
        }
        debugger
      this.userService.changePassword(loginDTO)?.subscribe({
        next: (response: any) => {
          debugger
          alert("Thay đổi mật khẩu thành công!")
          location.reload();
        },
        complete: () => {
          debugger
        },
        error: (error: any) => {          
          debugger
          alert(`Thay đổi mật khẩu thất bại: ${error.error.message}`);       
        }
      })

    });

  }


  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmNewPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  
}
