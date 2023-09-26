import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/user/home/home.component';
import { HeaderComponent } from './components/header-footer/header/header.component';
import { FooterComponent } from './components/header-footer/footer/footer.component';
import { DetailProductComponent } from './components/user/detail-product/detail-product.component';
import { OrderComponent } from './components/user/order/order.component';
import { OrderDetailComponent } from './components/user/order-detail/order-detail.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { 
  HttpClientModule, 
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { TokenInterceptor } from './interceptor/token.interceptor';

import { RouterModule, Routes } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/user/app/app.component';
import { OrderHistoryComponent } from './components/user/order-history/order-history.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { ProductsComponent } from './components/user/products/products.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AboutUsComponent } from './components/user/about-us/about-us.component';
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IdentityComponent } from './components/user/identity/identity.component';
import { AdminEditComponent } from './components/admin/admin-edit/admin-edit.component';
import { AdminListProductsComponent } from './components/admin/admin-list-products/admin-list-products.component';
import { AdminOrderConfirmComponent } from './components/admin/admin-order-confirm/admin-order-confirm.component';



@NgModule({
  declarations: [
    
    HomeComponent,
         HeaderComponent,
         FooterComponent,
         DetailProductComponent,
         OrderComponent,
         OrderDetailComponent,
         LoginComponent,
         RegisterComponent,
         AppComponent,
         OrderHistoryComponent,
         ChangePasswordComponent,
         ProductsComponent,
         AboutUsComponent,
         IdentityComponent,
         AdminEditComponent,
         AdminListProductsComponent,
         AdminOrderConfirmComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule, 
    HttpClientModule,
    AppRoutingModule,
    CarouselModule.forRoot(),
    MatDialogModule, 
    BrowserAnimationsModule, 
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    DatePipe
  ],
  bootstrap: [
    // AppModule
    // HomeComponent,
    // DetailProductComponent,
    // OrderComponent,
    // OrderConfirmComponent,
    // LoginComponent,
    // RegisterComponent
    AppComponent
  ]
})
export class AppModule { }
