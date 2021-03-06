package com.web.backend.service;

import com.web.backend.config.FileStorageConfig;
import com.web.backend.exception.FileNotFoundException;
import com.web.backend.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@Service
public class VideoStorageService {
    private final Path videoStorageLocation;

    @Autowired
    public VideoStorageService(FileStorageConfig fileStorageConfig) {
        this.videoStorageLocation = Paths.get(fileStorageConfig.getUploadDir()+"/api/video").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.videoStorageLocation);
        }catch (Exception e) {
            throw new FileStorageException("Could not create the directory where the uploaded file will be stored.", e);
        }
    }

    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        try {
            if(fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.videoStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        }catch (IOException e) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", e);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.videoStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if(resource.exists()) {
                return resource;
            }else {
                throw new FileNotFoundException("File not found " + fileName);
            }
        }catch (MalformedURLException e) {
            throw new FileNotFoundException("File not found " + fileName, e);
        }
    }
}
