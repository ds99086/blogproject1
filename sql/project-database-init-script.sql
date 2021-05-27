DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
	commentID INTEGER NOT NULL PRIMARY KEY,
	commentDate TIMESTAMT DEFAULT CURRENT_TIMESTAMP,
    commentText TEXT,
    commentLevel INTEGER DEFAULT 0, 
    parentComment INTEGER DEFAULT null,
    authorID INTEGER NOT NULL,
    parentArticleID INTEGER NOT NULL,
    FOREIGN KEY (authorID) REFERENCES users (userID),
    FOREIGN KEY (parentArticleID) REFERENCES articles (articleID)
	);

INSERT INTO comments VALUES
   (1, '2010-04-20', 'This is the first comment, no parent, article 1', 0, 0, 2, 1),
   (2, '2011-04-20', 'This is the second comment, no parent, article 1', 0, 0, 2, 1),
   (3, '2012-04-20', 'This is the third comment, replies to the first comment, article 1', 1, 1, 2, 1),
   (4, '2010-04-20', 'This is the fourth comment, replies to the second comment, article 1', 1, 2, 2, 1),
   (5, '2011-04-20', 'This is the fifth comment, replies to the third comment, article 1', 2, 3, 2, 1),
   (6, '2012-04-20', 'This is the sixth comment, replies to the first comment, article 1', 1, 1, 2, 1),
   (7, '2010-04-20', 'This is the seventh comment, replies to the fourth comment, article 1', 2, 4, 2, 1),
   (8, '2011-04-20', 'This is the eigth comment, replies to the second comment, article 1', 1, 2, 2, 1),
   (9, '2012-04-20', 'This is the ninth comment, replies to the second coment, article 1', 1, 2, 2, 1),
   (10, '2010-04-20', 'This is the tenth comment, no parent, article 1', 0, 0, 2, 1),
   (11, '2011-04-20', 'This is the elevnth comment, no parent, article 1', 0, 0, 2, 1),
   (12, '2012-04-20', 'This is the twelth comment, replies to the 10th comment, artcile 1', 1, 10, 2, 1);