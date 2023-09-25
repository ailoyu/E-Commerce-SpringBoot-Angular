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
import com.twinkle.shopapp.utils.ImageUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    private final ProductImageRepository productImageRepository;


    @Override
    @Transactional
    public Product createProduct(ProductDTO productDTO) throws DataNotFoundException, IOException {
        Category existingCategory = categoryRepository
                .findById(productDTO.getCategoryId())
                .orElseThrow(
                () -> new DataNotFoundException("Ko tìm thấy thể loại vs id = " + productDTO.getCategoryId()));

        Product newProduct = Product
                .builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice())
                .category(existingCategory)
                .description(productDTO.getDescription())
                .build();

        Product product = productRepository.save(newProduct);

        if(productDTO.getImages().length > 0){
            for(String imageURL : productDTO.getImages()){
                ProductImage productImage = new ProductImage();
                productImage.setProduct(product);
                productImage.setImageUrl(ImageUtils.storeFileWithBase64(imageURL));

                // Set ảnh đầu tiên làm thumbnail
                if(imageURL.equals(productDTO.getImages()[0])){
                    newProduct.setThumbnail(ImageUtils.storeFileWithBase64(imageURL));
                    productRepository.save(newProduct);
                }

                productImageRepository.save(productImage);
            }
        }
        return product;
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
    @Transactional
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

//            List<String> newImages = new ArrayList<>();
//             if(productDTO.getImages().length > 0){
//                 for(String image : productDTO.getImages()){
//                     String imageUrl;
//                     if(image.startsWith("http")){ // đường dẫn ảnh localhost://
//                         imageUrl = image.substring(image.lastIndexOf("/") + 1);
//                     } else { // đường dẫn ảnh BASE64
//                         imageUrl = ImageUtils.storeFileWithBase64(image);
//                     }
//                     newImages.add(imageUrl);
//                 }
//                 productImageRepository.deleteAllByProduct(existingProduct);
//             }


            List<String> newImages = Arrays.stream(productDTO.getImages())
                    .map(image -> {
                        try {
                            return image.startsWith("http") ?
                                    image.substring(image.lastIndexOf("/") + 1)
                                    : ImageUtils.storeFileWithBase64(image);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());

            productImageRepository.deleteAllByProduct(existingProduct);

            for(String image : newImages){
                ProductImage productImage = ProductImage.builder()
                        .product(existingProduct)
                        .imageUrl(image)
                        .build();
                productImageRepository.save(productImage);
            }

            return productRepository.save(existingProduct);

        }
        return null;
    }

    @Override
    @Transactional
    public void deleteProduct(Long[] ids) {
        for(long id : ids){
            Optional<Product> optionalProduct = productRepository.findById(id);
            if(optionalProduct.isPresent()){
                productRepository.delete(optionalProduct.get()); // nếu có product trong DB ms xóa

            }
        }
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
