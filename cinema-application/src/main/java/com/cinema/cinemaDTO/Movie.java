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

    @OneToMany(cascade=CascadeType.ALL, targetEntity=UserRating.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_movie_id")
    private Set<UserRating> userRatings;

    private double userRating = 0;

    public void addUserRating(UserRating userRating) {
        this.userRatings.add(userRating);
        this.calculateMovieRating();
    }

    public void deleteUserRating(String userRatingId) {
        this.userRatings.removeIf(userRate -> userRate.getId().equals(userRatingId));
        this.calculateMovieRating();
    }

    public void updateUserRating(UserRating userRating) {
        this.deleteUserRating(userRating.getId());
        this.addUserRating(userRating);
        this.calculateMovieRating();
    }

    public UserRating getUserRatingById(String userRatingId) {
        return this.userRatings.stream().filter(userRating -> {
            return userRating.getId().equals(userRatingId);
        }).findFirst().get();
    }

    private void calculateMovieRating() {
        this.userRating = this.userRatings.stream().mapToInt(userRating1 -> userRating1.getRating()).average().orElse(0);
    }
}
