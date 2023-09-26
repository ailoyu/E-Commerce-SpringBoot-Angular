import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { Category } from 'src/app/model/category';
import { Product } from 'src/app/model/product';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-admin-list-product',
  templateUrl: './admin-list-products.component.html',
  styleUrls: ['./admin-list-products.component.scss']
})
export class AdminListProductsComponent {
  products: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5; // 10 items/ 1 trang
  pages: number [] = [];
  totalPages: number = 0;
  visiblePages: number [] = [];
  keyword: string = "";
  categories: Category[] = []; // Dữ liệu động từ CategoryService
  selectedCategoryId: number = 0; // Giá trị category được chọn

  constructor(private productService :ProductService,
    private categoryService: CategoryService,
    private router: Router
    ){}

  ngOnInit() {
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
      this.getCategories();
  }

  

  getCategories(){
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        debugger 
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error("Lỗi bắt dữ liệu thể loại", error);
      }
    });
  }

  searchProducts(){
    this.currentPage = 1;
    this.itemsPerPage = 5;
    debugger
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number){
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {
        
        response.products.forEach((product : Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });
        debugger
        this.products = response.products;
        this.totalPages = response.totalPage;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error("Lỗi bắt dữ liệu sản phẩm", error);
      }
    });
  }

  onPageChange(page: number){
    debugger;
    this.currentPage = page;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  

  generateVisiblePageArray(currentPage: number, totalPages: number): number[]{
    const maxVisiblePages = 5; // cho hiện ra 5 trang để chọn
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if(endPage - startPage + 1 < maxVisiblePages){
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
    
    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }
   // Hàm xử lý sự kiện khi sản phẩm được bấm vào
   onProductClick(productId: number) {
    debugger
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/admin/edit-products', productId]);
  }


  selectedIds: number[] = [];


  toggleSelection(id: number) {
    const index = this.selectedIds.indexOf(id);
    if (index > -1) {
      this.selectedIds.splice(index, 1); // Remove ID if already selected
    } else {
      this.selectedIds.push(id); // Add ID if not selected
    }
  }

  toggleAllCheckboxes() {
    const checkboxes = document.getElementsByName('foo');
    const checkAllCheckbox = document.getElementById('checkAll') as HTMLInputElement;
    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i] as HTMLInputElement;
    checkbox.checked = checkAllCheckbox.checked;

    if (checkbox.checked) {
      const productId =  parseInt(checkbox.value, 10); // Convert to number
      this.toggleSelection(productId);
    }
    }
  }

  deleteSelectedProducts() {
    debugger
    console.log(this.selectedIds);
    this.productService.deleteProducts(this.selectedIds)?.subscribe({
      next: (product) => {
        
        alert("Xóa sản phẩm thành công");
        location.reload();
      },
      complete: () => {
      
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
        alert("Xóa sản phẩm thất bại");
      }
    });
  }




}
