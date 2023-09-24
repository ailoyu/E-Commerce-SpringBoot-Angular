package com.twinkle.shopapp.services.impl;

import com.twinkle.shopapp.dtos.ProductDTO;
import com.twinkle.shopapp.dtos.ProductImageDTO;
import com.twinkle.shopapp.exceptions.DataNotFoundException;
import com.twinkle.shopapp.exceptions.InvalidParamException;
import com.twinkle.shopapp.models.Category;
import com.twinkle.shopapp.models.Product;
import com.twinkle.shopapp.models.ProductImage;
import com.twinkle.shopapp.repositories.CategoryRepository;
import com.twinkle.shopapp.repositories.ProductImageRepository;
import com.twinkle.shopapp.repositories.ProductRepository;
import com.twinkle.shopapp.responses.ProductResponse;
import com.twinkle.shopapp.services.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final ProductImageRepository productImageRepository;


    @Override
    public Product createProduct(ProductDTO productDTO) throws DataNotFoundException {
        Category existingCategory = categoryRepository
                .findById(productDTO.getCategoryId())
                .orElseThrow(
                () -> new DataNotFoundException("Ko tìm thấy thể loại vs id = " + productDTO.getCategoryId()));
        Product newProduct = Product
                .builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice())
                .thumbnail(productDTO.getThumbnail())
                .category(existingCategory)
                .description(productDTO.getDescription())
                .build();
        return productRepository.save(newProduct);
    }

    @Override
    public Product getProductById(long id) throws Exception {
        return productRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Ko tìm thấy id " + id));
    }

    public List<Product> findProductByIds(List<Long> productIds){
        return productRepository.findProductById(productIds);
    }

    @Override
    public Page<ProductResponse> getAllProducts(String keyword, Long categoryId,
                                                PageRequest pageRequest) {
        // Lấy danh sách sản phẩm theo page hiện tại và limit
        return productRepository.searchProducts(categoryId, keyword, pageRequest).map(product ->
                // parse từ product -> ProductResponse: kết quả muốn trả ra client
                ProductResponse.fromProduct(product));
     }

    @Override
    public Product updateProduct(long id, ProductDTO productDTO) throws Exception {
        Product existingProduct = getProductById(id);
        if(existingProduct != null){
            Category existingCategory = categoryRepository
                    .findById(productDTO.getCategoryId())
                    .orElseThrow(
                            () -> new DataNotFoundException("Ko tìm thấy thể loại vs id = " + productDTO.getCategoryId()));

            // Convert từ DTO -> Product (Dùng ModelMapper or Object Mapper)
            existingProduct.setName(productDTO.getName());
            existingProduct.setCategory(existingCategory);
            existingProduct.setPrice(productDTO.getPrice());
            existingProduct.setDescription(productDTO.getDescription());
            existingProduct.setThumbnail(productDTO.getThumbnail());
            return productRepository.save(existingProduct);

        }
        return null;
    }

    @Override
    public void deleteProduct(long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if(optionalProduct.isPresent())
            productRepository.delete(optionalProduct.get()); // nếu có product trong DB ms xóa
    }

    @Override
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

    @Override
    public ProductImage createProductImage(
            ProductImageDTO productImageDTO) throws Exception {
        Product existingProduct = productRepository
                .findById(productImageDTO.getProductId())
                .orElseThrow(
                        () -> new DataNotFoundException("Ko tìm thấy sản phẩm vs id = " +
                                productImageDTO.getProductId()));

        ProductImage newProductImage = ProductImage
                .builder()
                .product(existingProduct)
                .imageUrl(productImageDTO.getImageUrl())
                .build();

        // Ko cho insert quá 5 ảnh cho 1 sản phẩm
        int size = productImageRepository.findByProductId(productImageDTO.getProductId()).size();
        if(size >= 5){
            throw new InvalidParamException(
                    "Sản phẩm này đã có "+size + " ảnh");
        }
        return productImageRepository.save(newProductImage);

    }
}
