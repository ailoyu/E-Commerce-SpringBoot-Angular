import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { LoginDTO } from 'src/app/dtos/user/login.dto';
import { NgForm } from '@angular/forms';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { TokenService} from 'src/app/service/token.service';
import { RoleService } from 'src/app/service/role.service';
import { Role } from 'src/app/model/role';
import { RegisterDTO } from 'src/app/dtos/user/register.dto';
import { HeaderComponent } from '../../header-footer/header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild(`loginForm`) loginForm!: NgForm;

  phoneNumber: string = '';
  password: string = '';

  isLoading = false;

  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userInfo: any;

  onPhoneNumberChange(){
    console.log(`Phone typed: ${this.phoneNumber}`);
    // Kiểm tra phone phải > 6 ký tự

  } 

  constructor(
    private router: Router, 
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService) {
    // Inject
    

  }


  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles ở ngoài Login
    this.tokenService.removeToken();

    debugger
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => { // Sử dụng kiểu Role[]
        debugger
        this.roles = roles; // hiển thị danh sách roles ra client

        // lấy role đầu tiên làm default hiện ra,
        this.selectedRole = roles.length > 0 ? roles[0] : undefined; 
      },
      error: (error: any) => {
        debugger
        console.error('Error getting roles:', error);
      }
    });
  }

  login(){

    this.isLoading = true;

    // alert(message);


    const loginDTO: LoginDTO = {
    "phone_number" : this.phoneNumber,
    "password" : this.password,
    "role_id": this.selectedRole?.id ?? 1,
    "new_password": '',
    "confirm_new_password" : ''
    }

    // Bắt đầu gửi JSON tới API
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger
        // Xử lý kết quả trả về khi ĐĂNG NHẬP THÀNH CÔNG

        // Lưu token trong localStorage cho các request API khác (gắn token vào các Headers)
        const {token} = response;
        
        if(this.rememberMe){
          this.tokenService.setToken(token);
        }
        alert("Đăng nhập thành công");
        this.router.navigate(['/home']);          
      },
      complete: () => {
        
        debugger
      },
      error: (error: any) => {          
        // Xử lý khi ĐĂNG KÝ KO THÀNH CÔNG
        console.log(`Đăng nhập không thành công ` + error.error.message);
        alert(`Đăng nhập không thành công (`+ error.error.message + ')');     
        this.isLoading = false;     
      }
    })
    

  }
}
