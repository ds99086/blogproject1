/*
 * COMPSCI 718 719 Group Project, ABY: Allie Lim, Nicholas Berg, Yiwei Diao
 *
 * SQLite Script to generate the database for our Blog webiste 

* Relational Schema
* users(userID, username, hashPassword, firstName, lastName, dateOfBirth, avatarImage, authToken, adminstratorLevel, introduction)
* articles(articleID, title, publishDate, lastEditDate, bodyContentOrLinkToContent, *authorID*)
* comments(commentID, commentDate, commentText, commentLevel, parentComment, *authorID*, *parentArticleID* )
* votes(*userID*, *commentID*, voteValue)
* articleVotes (*userID*, *articleID*, voteValue)
*
*
*/

--Drop existing tables to reinitialise the data base.
--Commented out for safety.

DROP TABLE IF EXISTS articleVotes;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
	userID INTEGER NOT NULL PRIMARY KEY,
	username VARCHAR(100),
    hashPassword VARCHAR(100),
    firstName VARCHAR(100),
	lastName VARCHAR(100),
	dateOfBirth DATE,
    avatarImage VARCHAR(50),
    authToken VARCHAR(128),
    adminstratorLevel INTEGER DEFAULT 0,
    introduction VARCHAR(500)
	);

CREATE TABLE articles (
	articleID INTEGER NOT NULL PRIMARY KEY,
	title VARCHAR(100),
    publishDate DATE,
    lastEditDate DATE,
    bodyContentOrLinkToContent VARCHAR(100),
    authorID INTEGER,
    FOREIGN KEY (authorID) REFERENCES users (userID)
	);

CREATE TABLE comments (
	commentID INTEGER NOT NULL PRIMARY KEY,
	commentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commentText TEXT,
    commentLevel INTEGER DEFAULT 0, 
    parentComment INTEGER DEFAULT null,
    authorID INTEGER NOT NULL,
    parentArticleID INTEGER NOT NULL,
    FOREIGN KEY (authorID) REFERENCES users (userID),
    FOREIGN KEY (parentArticleID) REFERENCES articles (articleID)
	);

CREATE TABLE votes (
	userID INTEGER NOT NULL,
	commentID INTEGER NOT NULL,
	voteValue INTEGER,
	PRIMARY KEY (userID,commentID),
    FOREIGN KEY (userID) REFERENCES users (userID),
	FOREIGN KEY (commentID) REFERENCES comments (commentID)
	);
	
	
CREATE TABLE articleVotes (
	userID INTEGER NOT NULL,
	articleID INTEGER NOT NULL,
	voteValue INTEGER,
	PRIMARY KEY (userID, articleID),
    FOREIGN KEY (userID) REFERENCES users (userID),
	FOREIGN KEY (articleID) REFERENCES articles (articleID)
	);
	
--users(userID, username, hashPassword, firstName, lastName, dateOfBirth, avatarImage, authToken, adminstratorLevel, introduction)
INSERT INTO users (userID, username, hashPassword, firstName, lastName, dateOfBirth, avatarImage, authToken, adminstratorLevel, introduction) VALUES
   (1, 'XeroFounder', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'Rodney', 'Drury', '1967-06-23', '01', null, 0, ''),
   (2, 'salesForceField', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'Marc', 'Benioff', '1964-09-25', '2', null, 0, 'I made sales force and lots of $'),
   (3, 'datacomDude', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'Bernard', 'Battersby', '1990-01-01', '3', null, 0, 'this user does not yet have an introduction'),
   (4, 'enigmaCracker', '$2b$10$rQAvdV7Ka58JUxUx5siKsusBcEF71QDmfsChx6B39reCfD2.FdxbS', 'Alan', 'Turing', '1912-06-23', '1', null, 0, ''),
   (5, 'theAdmiral', '$2b$10$rQAvdV7Ka58JUxUx5siKsusBcEF71QDmfsChx6B39reCfD2.FdxbS', 'Grace', 'Hopper', '1906-12-09', '2', null, 0, ''),
   (6, 'don', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'Donald', 'Knuth', '1938-01-10', '3', null, 0, ''),
   (7, 'SerkoGetsYouThere', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '3', null, 0, 'this user does not yet have an introduction'),
   (8, 'DoNoEvil', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '3', null, 0, 'this user does not yet have an introduction'),
   (9, 'Windows4Ever', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'Bill', 'Gates', '1990-01-01', '3', null, 0, 'this user does not yet have an introduction'),
   (10, 'username10', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '3', null, 0, 'this user does not yet have an introduction'),
   (11, 'username11', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '3', null, 0, 'this user does not yet have an introduction'),
   (12, 'username12', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '3', null, 0, 'this user does not yet have an introduction'),
   (13, 'username13', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '3', null, 0, 'this user does not yet have an introduction'),
   (14, 'username14', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '3', null, 0, 'this user does not yet have an introduction'),
   (15, 'username15', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '3', null, 0, 'this user does not yet have an introduction');
 

--articles(articleID, title, publishDate, lastEditDate, bodyContentOrLinkToContent, *authorID*)
INSERT INTO articles VALUES
    (1,'redirect test','2021-01-23','2021-05-27 22:39:37','',4);
				
--comments(commentID, commentDate, commentText, commentLevel, parentComment, *authorID*, *parentArticleID* )
INSERT INTO comments VALUES
   (1, '2021-06-01 23:10:09', 'This is the first comment, no parent, article 1', 0, 0, 4, 1);
   
-- votes(*userID*, *commentID*, voteValue)
INSERT INTO votes VALUES
	(1, 1, 1);
   
--articleVotes (*userID*, *articleID*, voteValue)	