import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { UserService } from 'src/app/service/user.service';
import { RegisterDTO } from 'src/app/dtos/user/register.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  
  @ViewChild(`registerForm`) registerForm!: NgForm;

  // khai báo các field dữ liệu trong form
  phoneNumber: string;
  password: string;
  retypePassword : string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;

  isLoading = false;

  

  onPhoneNumberChange(){
    console.log(`Phone typed: ${this.phoneNumber}`);
    // Kiểm tra phone phải > 6 ký tự

  }

  constructor(private router: Router, private userService: UserService) {
    this.phoneNumber = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = false;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);

    // Inject

  }

  register(){
    this.isLoading = true;
    
    const message = `phone: ${this.phoneNumber}` + 
                    `password: ${this.password}` +
                    `retypePassword: ${this.retypePassword}` +
                    `address: ${this.address}` +
                    `fullName: ${this.fullName}` +
                    `isAccepted: ${this.isAccepted}` + 
                    `dateOfBirth: ${this.dateOfBirth}`;
    // alert(message);


    const registerDTO: RegisterDTO = {
      "fullname" : this.fullName,
    "phone_number" : this.phoneNumber,
    "address" : this.address,
    "password" : this.password,
    "retype_password" : this.retypePassword,
    "date_of_birth" : this.dateOfBirth,
    "facebook_account_id" : 0,
    "google_account_id" : 0,
    "role_id" : 1,
    }

    // Bắt đầu gửi JSON tới API
    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        debugger
        // Xử lý kết quả trả về khi ĐĂNG KÝ THÀNH CÔNG
        alert("Đăng ký thành công!")
        this.router.navigate(['/login']);          
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {          
        // Xử lý khi ĐĂNG KÝ KO THÀNH CÔNG
        alert(`Ko thể đăng ký thành công: ${error.error.message}`);       
        this.isLoading = false;
      }
    })
    

  }


  checkPasswordMatch(){

  // Kiểm tra 2 mật khẩu match vs nhau
    if(this.password !== this.retypePassword){
      this.registerForm.form.controls['retypePassword'].setErrors({'passwordMismatch': true});
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }

  // check tuổi phải trên 18
  checkAge(){
    if(this.dateOfBirth){
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())){
        age--;
      }
      
      if(age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({'invalidAge' : true});
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }

    }

    
  }


}
