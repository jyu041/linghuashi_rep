// backend/src/main/java/org/jyu041/backend/repository/EquipmentRepository.java
package org.jyu041.backend.repository;

import org.jyu041.backend.entity.Equipment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EquipmentRepository extends MongoRepository<Equipment, String> {
}