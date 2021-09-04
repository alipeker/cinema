package com.cinema.repository;

import com.cinema.cinemaDTO.StreamingFileRecord;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public interface StreamingFileRepository extends CrudRepository<StreamingFileRecord, Long> {
}
