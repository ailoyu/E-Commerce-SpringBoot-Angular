import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { RegisterDTO } from 'src/app/dtos/user/register.dto';
import { UpdateUserDTO } from 'src/app/dtos/user/update.dto';
import { environment } from 'src/app/environments/environment';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { TokenService } from 'src/app/service/token.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class IdentityComponent implements OnInit{
  

  constructor(private tokenService: TokenService,
    private userService: UserService,
    private router: Router){
  }

  loginResponse$!: Observable<LoginResponse> | null;
    loginResponse!: LoginResponse | null;
  
  ngOnInit(): void {
    this.loginResponse$ = this.tokenService.displayUserInformation();

    this.loginResponse$?.subscribe(response => {
      debugger
      this.loginResponse = { ...response };
      this.address = this.loginResponse.address;
      this.fullName = this.loginResponse.fullname;
      this.phoneNumber = this.loginResponse.phone_number;
      if (!this.loginResponse.avatar.startsWith("http")) {
        this.loginResponse.avatar = `${environment.apiBaseUrl}/products/images/${this.loginResponse.avatar}`;
      } 
      debugger
      console.log(this.loginResponse);
    });  
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) {
      return ''; // Return empty string if dateString is null or undefined
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero if necessary
    const day = ("0" + date.getDate()).slice(-2); // Add leading zero if necessary
    return `${year}-${month}-${day}`;
  }

  updateAvatar() {
    // khi nhấn file lấy ra avatar
    const fileInput = document.getElementById('avatar') as HTMLInputElement;
    fileInput?.click();

  }
  
  previewFile() {
    const fileInput = document.getElementById('avatar') as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    const reader = new FileReader();
  
    reader.onloadend = () => {
      // bỏ đường dẫn file vào vào khung <img> 
      const avatarImage = document.getElementById('avatarImage') as HTMLImageElement;
      const base64String = reader.result as string;

      avatarImage.src = base64String; // bỏ base64 vào đường dẫn

      
      this.avatar = base64String;
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }


  phoneNumber!: string;
  fullName!: string;
  address!: string;
  avatar!: string;
  dateOfBirth!: Date;

  
  isLoading = false;

  updateUser(){
    // Bắt đầu gửi JSON tới API
    debugger
    this.isLoading = true;
    const updateUserDto: UpdateUserDTO = {
      "fullname": this.fullName,
      "phone_number": this.phoneNumber,
      "address": this.address,
      "avatar": this.avatar,
      // "date_of_birth" : this.dateOfBirth
    }
    console.log(updateUserDto);
    this.userService.updateUser(updateUserDto).subscribe({
      next: (response: any) => {
        debugger
        // Xử lý kết quả trả về khi ĐĂNG KÝ THÀNH CÔNG
        alert("Cập nhật thành công!")
        this.isLoading = false;
        location.reload();
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {          
        // Xử lý khi ĐĂNG KÝ KO THÀNH CÔNG
        alert(`Ko thể đăng ký thành công: ${error.error.message}`);     
        this.isLoading = false;  
        location.reload();
      }
    })
  }

}
