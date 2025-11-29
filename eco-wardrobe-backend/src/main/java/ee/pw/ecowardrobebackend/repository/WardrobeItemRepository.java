package ee.pw.ecowardrobebackend.repository;

import ee.pw.ecowardrobebackend.entity.WardrobeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WardrobeItemRepository extends JpaRepository<WardrobeItem, UUID> {
    List<WardrobeItem> findByUserId(UUID userId);
    List<WardrobeItem> findByUserIdAndProductCategory(UUID userId, String category);
}

