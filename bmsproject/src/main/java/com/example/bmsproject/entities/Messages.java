package com.example.bmsproject.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
public class Messages {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private Users user;

    private String content;

    private boolean isAdminMessage;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp=new Date();

    public Messages(Integer id, Users user, String content, boolean isAdminMessage, Date timestamp) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.isAdminMessage = isAdminMessage;
        this.timestamp = new Date();
    }


}
