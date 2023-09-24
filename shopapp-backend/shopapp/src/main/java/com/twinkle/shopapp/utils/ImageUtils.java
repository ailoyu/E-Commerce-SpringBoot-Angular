package com.twinkle.shopapp.utils;

import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

public class ImageUtils {

    public static String storeFile(MultipartFile file) throws IOException {

        if(isImageFile(file) || file.getOriginalFilename() == null) {
            throw new IOException("Định dạng file ko hợp lệ");
        }

        // Lấy ra file name của ảnh .jpg/jpeg/png
        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        // Thêm UUID vào trước tên file để đảm bảo tên file là duy nhất
        String generatedFileName = UUID.randomUUID().toString() + "_" + filename;

        String fileName = storeFileInFolder(file, generatedFileName);
        return fileName;

    }

    public static boolean isImageFile(MultipartFile file){
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("/image");
    }

    public static String storeFileWithBase64(String base64) throws IOException {
        String[] strings = base64.split(",");
        String extension;
        switch (strings[0]) {//check image's extension
            case "data:image/jpeg;base64":
                extension = "jpeg";
                break;
            case "data:image/png;base64":
                extension = "png";
                break;
            default://should write cases for more images types
                extension = "jpg";
                break;
        }

        //convert base64 string to binary data
        byte[] imageAvatar = DatatypeConverter.parseBase64Binary(strings[1]);
        String generatedFileName = UUID.randomUUID().toString().replace("-", "");
        CustomMultipartFile multipartFile = new CustomMultipartFile(imageAvatar);
        generatedFileName = generatedFileName + "." + extension;

        String fileName = storeFileInFolder(multipartFile, generatedFileName);
        return fileName;

    }

    private static String storeFileInFolder(MultipartFile file, String generatedFileName) throws IOException {
        // Đường dẫn đến thư mục mà bạn muốn lưu file
        Path uploadDir = Paths.get("uploads");

        // Kiểm tra và tạo thư mục nếu nó không tồn tại
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Đường dẫn đầy đủ đến file destination
        java.nio.file.Path destination = Paths.get(uploadDir.toString(), generatedFileName);

        // Sao chép file vào thư mục đích
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        return generatedFileName;
    }

}
