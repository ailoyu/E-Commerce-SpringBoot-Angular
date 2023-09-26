import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ProductsComponent } from './components/products/products.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { IdentityComponent } from './components/identity/identity.component';
import { AdminEditComponent } from './components/admin-edit/admin-edit.component';
import { AdminAuthGuard } from './service/admin.authorization.service';
import { LoginAuthGuard } from './service/login.authorization.service';
import { AdminListProductsComponent } from './components/admin-list-products/admin-list-products.component';
import { AdminOrderConfirmComponent } from './components/admin-order-confirm/admin-order-confirm.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'order', component: OrderComponent }, 
  { path: 'order-detail', component: OrderDetailComponent}, 
  { path: 'detail-product/:id', component: DetailProductComponent }, // Route cho DetailProductComponent
  { path: 'order-history', component: OrderHistoryComponent, canActivate:[LoginAuthGuard]},
  { path: 'about-us', component: AboutUsComponent},
  { path: 'info', component: IdentityComponent, canActivate:[LoginAuthGuard]},
  { path: 'change-password', component: ChangePasswordComponent, canActivate:[LoginAuthGuard]},
  { 
    path: 'admin', 
    canActivate: [AdminAuthGuard], 
    children: [
      { path: 'edit-products', component: AdminEditComponent },
      { path: 'edit-products/:id', component: AdminEditComponent },
      { path: 'list-products', component: AdminListProductsComponent },
      { path: 'order-confirm/:status', component: AdminOrderConfirmComponent },
    ]
  },


  // { path: '**', component: HomeComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
