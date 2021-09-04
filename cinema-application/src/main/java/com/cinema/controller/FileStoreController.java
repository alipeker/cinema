package com.cinema.controller;

import com.cinema.cinemaDTO.StreamingFileRecord;
import com.cinema.repository.StreamingFileRepository;
import com.cinema.uploadingfiles.LobHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.SQLException;
import javax.servlet.http.HttpServletResponse;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("file")
public class FileStoreController {

    private final StreamingFileRepository streamingFileRepository;
    private final LobHelper lobCreator;

    @Autowired
    public FileStoreController(StreamingFileRepository streamingFileRepository, LobHelper lobCreator) {
        this.streamingFileRepository = streamingFileRepository;
        this.lobCreator = lobCreator;
    }

    @RequestMapping(value = "/blobs", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> store(@RequestParam("file") MultipartFile multipartFile) throws IOException, SQLException, URISyntaxException {
        StreamingFileRecord streamingFileRecord = new StreamingFileRecord(multipartFile.getOriginalFilename(), lobCreator.createBlob(multipartFile.getInputStream(), multipartFile.getSize()));

        streamingFileRecord = streamingFileRepository.save(streamingFileRecord);

        return ResponseEntity.created(new URI("http://localhost:8080/blobs/" + streamingFileRecord.getId())).build();
    }

    @RequestMapping(value = "/blobs/{id}", method = RequestMethod.GET)
    public void load(@PathVariable("id") long id, HttpServletResponse response) throws SQLException, IOException {
        StreamingFileRecord record = streamingFileRepository.findById(id).get();
        IOUtils.copy(record.getData().getBinaryStream(), response.getOutputStream());
        response.getOutputStream().flush();
    }

}
