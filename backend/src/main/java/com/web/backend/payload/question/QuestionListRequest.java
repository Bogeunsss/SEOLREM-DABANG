package com.web.backend.payload.question;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
@NotNull
public class QuestionListRequest {
    String [] contentList;
    Boolean [] correctAnswerList;
}
