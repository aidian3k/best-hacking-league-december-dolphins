package ee.pw.ecowardrobebackend.repository;

import ee.pw.ecowardrobebackend.entity.sharing.WardrobeShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WardrobeShareRepository extends JpaRepository<WardrobeShare, UUID> {
}
