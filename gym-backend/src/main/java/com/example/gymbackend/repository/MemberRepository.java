// MemberRepository.java
package com.example.gymbackend.repository;
import com.example.gymbackend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {}