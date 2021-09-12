package com.cinema.cinemaDTO;

import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Data
public class Movie implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private Long id;

    private String name;

    private String subject;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> moviePhotos;

    private String ratingScore;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> genres;

    private String duration;

    private String year;

    @ManyToMany(cascade=CascadeType.ALL, targetEntity=MoviePerson.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "movie_id")
    private Set<MoviePerson> moviePersons;

    @ManyToMany(cascade=CascadeType.ALL, targetEntity=UserRating.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_movie_id")
    private Set<UserRating> userRatings;

    public void addUserRating(UserRating userRating) {
        this.userRatings.add(userRating);
    }

    public void deleteUserRating(Long userRatingId) {
        this.userRatings.stream().filter(userRating -> {
            if(userRatingId.equals(userRating.getId())){
                return this.userRatings.remove(userRating);
            }
            return false;
        });
    }

    public void updateUserRating(UserRating userRating) {
        this.userRatings.stream().filter(userRating1 -> {
            userRating1.setComment("degisti");
            return false;
        });
    }

    public void getUserRatingById(UserRating userRating) {
        this.userRatings.add(userRating);
    }
}
