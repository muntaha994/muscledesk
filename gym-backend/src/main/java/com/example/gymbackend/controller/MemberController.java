// MemberController.java
package com.example.gymbackend.controller;

import com.example.gymbackend.model.Member;
import com.example.gymbackend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:3000") // Prevents CORS errors from Next.js
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @PostMapping
    public Member addMember(@RequestBody Member member) {
        // If the trainer object or its ID is null/0, set the relation to null
        if (member.getTrainer() == null || member.getTrainer().getId() == null || member.getTrainer().getId() == 0) {
            member.setTrainer(null);
        }
        return memberRepository.save(member);
    }

    @DeleteMapping("/{id}")
    public void deleteMember(@PathVariable Long id) {
        memberRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Member updateMember(@PathVariable Long id, @RequestBody Member memberDetails) {
        return memberRepository.findById(id)
            .map(member -> {
                member.setName(memberDetails.getName());
                member.setEmail(memberDetails.getEmail());
                member.setPhone(memberDetails.getPhone());
                member.setMembership(memberDetails.getMembership());
                
                // Safe null check for updates
                if (memberDetails.getTrainer() == null || memberDetails.getTrainer().getId() == null || memberDetails.getTrainer().getId() == 0) {
                    member.setTrainer(null);
                } else {
                    member.setTrainer(memberDetails.getTrainer());
                }
                
                return memberRepository.save(member);
            })
            .orElseGet(() -> {
                memberDetails.setId(id);
                return memberRepository.save(memberDetails);
            });
    }

}