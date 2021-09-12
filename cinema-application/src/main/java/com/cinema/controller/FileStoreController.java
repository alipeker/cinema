package com.cinema.controller;

import com.cinema.cinemaDTO.FileResponse;
import com.cinema.uploadingfiles.FileSystemStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@RestController
@RequestMapping("file")
public class FileStoreController {

    @Autowired
    private FileSystemStorageService storageService;

    @GetMapping(value= "/uploads/{filename:.+}", produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        Resource resource = storageService.loadAsResource(filename);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/uploadImage")
    @ResponseBody
    public FileResponse uploadFile(@RequestParam("file") MultipartFile file) {
        String filename = UUID.randomUUID().toString()+".png";
        String name = storageService.store(file, filename);

        return new FileResponse(name, "/img/"+filename, file.getContentType(), file.getSize());
    }

}
