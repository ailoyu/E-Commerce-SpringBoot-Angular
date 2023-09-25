import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderConfirmComponent } from './components/order-confirm/order-confirm.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { 
  HttpClientModule, 
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { TokenInterceptor } from './interceptor/token.interceptor';

import { RouterModule, Routes } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProductsComponent } from './components/products/products.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IdentityComponent } from './components/identity/identity.component';
import { AdminEditComponent } from './components/admin-edit/admin-edit.component';
import { AdminListProductsComponent } from './components/admin-list-products/admin-list-products.component';



@NgModule({
  declarations: [
    
    HomeComponent,
         HeaderComponent,
         FooterComponent,
         DetailProductComponent,
         OrderComponent,
         OrderConfirmComponent,
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
