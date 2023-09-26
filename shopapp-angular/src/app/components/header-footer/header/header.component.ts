import { Component, Injectable, OnInit } from '@angular/core';
import { LoginComponent } from '../../user/login/login.component';
import { TokenService } from 'src/app/service/token.service';
import { RegisterDTO } from 'src/app/dtos/user/register.dto';
import { UserService } from 'src/app/service/user.service';
import { Observable } from 'rxjs';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('dropdownAnimation', [
      state('open', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('closed', style({
        opacity: 0,
        transform: 'translateY(-10px)'
      })),
      transition('closed => open', [
        animate('200ms ease-out')
      ]),
      transition('open => closed', [
        animate('200ms ease-in')
      ])
    ])
  ]
})
@Injectable({
  providedIn: 'root'
})
export class HeaderComponent implements OnInit {

  constructor(private tokenService: TokenService,
    private userService: UserService,
    private router: Router){
    }
    

    user: any;
    userFromToken: any;
    
    loginResponse$!: Observable<LoginResponse> | null;
    loginResponse!: LoginResponse | null;
    


  ngOnInit(): void {
    debugger
    this.loginResponse$ = this.tokenService.displayUserInformation();

    this.loginResponse$?.subscribe(response => {
      this.loginResponse = { ...response };
      debugger
    console.log(this.loginResponse);
    });
    
  }

  

  signOut(){
    this.tokenService.removeToken();
    location.reload();
    
  }

  
}
