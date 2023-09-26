import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../model/product";

@Injectable({
    providedIn: 'root'
})
export class ProductService{
    
    private apiProducts = `${environment.apiBaseUrl}/products`;

    constructor(private http: HttpClient){}

    getProducts(keyword:string, categoryId: number,
        page: number, limit: number): Observable<Product[]>{
        const params = new HttpParams()
        .set('keyword', keyword)
        .set('category_id', categoryId)
        .set('page', page.toString())
        .set('limit', limit.toString());
        return this.http.get<Product[]>(this.apiProducts, {params});
    }

    getDetailProduct(productId: number){
        return this.http.get(`${environment.apiBaseUrl}/products/${productId}`);
    }

    getProductsByIds(productIds: number[]): Observable<Product[]> {
        // Chuyển danh sách ID thành một chuỗi và truyền vào params
        // ids = 1,2,3,4,5
        debugger
        const params = new HttpParams().set('ids', productIds.join(',')); 
        return this.http.get<Product[]>(`${this.apiProducts}/by-ids`, { params });
      }

      saveProduct(product: Product): Observable<any>{
        debugger
        return this.http.post(this.apiProducts, product);
    }


    updateProduct(product: Product): Observable<any>{
        debugger
        return this.http.put(`${environment.apiBaseUrl}/products/` + product.id, product);
    }

    deleteProducts(selectedIds: number[]): Observable<any>{
        debugger
        const options = {
            body: { ids: selectedIds }
          };
        return this.http.delete(`${environment.apiBaseUrl}/products/`, options);
    }


}