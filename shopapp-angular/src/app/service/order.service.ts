import { ProductService } from './product.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { OrderDTO } from '../dtos/order/order.dto';
import { LoginResponse } from '../responses/user/login.response';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  constructor(private http: HttpClient,
    private tokenService: TokenService) {}

  private apiUrl = `${environment.apiBaseUrl}/orders`;


  placeOrder(orderData: OrderDTO): Observable<any> {  
    // Gửi yêu cầu đặt hàng
    debugger
    return this.http.post(this.apiUrl, orderData);
  }


  private getOrderURL = `${environment.apiBaseUrl}/orders`;


  getOrderByUserId(user_id: number): Observable<any> | null {   
    debugger 
    const token: string = this.tokenService.getToken() || '';
      
        if (token.length !== 0) {
          // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          const url = `${environment.apiBaseUrl}/orders/history/${user_id}`;
    
          return this.http.get<any>(url);
        }
  return null;
  }

  getAdminOrders(status: string): Observable<any> | null {   
    debugger 
    const token: string = this.tokenService.getToken() || '';
      
        if (token.length !== 0) {
          // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          const url = `${environment.apiBaseUrl}/orders/order-confirm/` + status;
    
          return this.http.get<any>(url);
        }
    return null;
  }

  updateOrder(orderId: number, status: string){
    const token: string = this.tokenService.getToken() || '';
      
        if (token.length !== 0) {
          // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    
          return this.http.put(url, status);
        }
    return null;
  }

}
