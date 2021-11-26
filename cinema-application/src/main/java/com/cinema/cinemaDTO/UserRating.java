package com.cinema.cinemaDTO;

import lombok.Data;
import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@Entity
@Data
public class UserRating {
    @Id
    @Column
    private String id;

    @Column(name = "CHAPTER_CODE", nullable = false,  length = 10000)
    private String comment;

    @Column
    private String date;

    @Min(value = 1)
    @Max(value = 10)
    private int rating;

    @OneToOne(cascade = CascadeType.PERSIST, fetch=FetchType.EAGER)
    private User user;

    public UserRating() {
    }
}
