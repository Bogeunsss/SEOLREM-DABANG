package com.web.backend.model.Conversation;

import com.web.backend.model.accounts.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ConversationContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conversationContentId;

    @Column(name="voice")
    private String voice;

    @Column(name="text")
    private String text;

    @ManyToOne
    @JoinColumn(name="conversation_id")
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name="user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Builder
    public ConversationContent(String voice,Conversation conversation,User user, String text){
        this.voice=voice;
        this.conversation = conversation;
        this.user = user;
        this.text = text;
    }
}
