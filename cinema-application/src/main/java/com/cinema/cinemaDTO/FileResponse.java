package com.cinema.cinemaDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileResponse {
    private String name;
    private String uri;
    private String type;
    private long size;
}
