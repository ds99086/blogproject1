/*
 * COMPSCI 718 719 Group Project, ABY: Allie Lim, Nicholas Berg, Yiwei Diao
 *
 * SQLite Script to generate the database for our Blog webiste 

* Relational Schema
* users(userID, username, passwordFieldsToUpdate, firstName, lastName, dateOfBirth)
* articles(articleID, title, publishDate, lastEditDate, bodyContentOrLinkToContent, *authorID*)
* comments(commentID, commentDate, commentText, commentLevel, parentComment, *authorID*, *parentArticleID* )
* votes(*userID*, *commentID*, voteValue)
 */

--Drop existing tables to reinitialise the data base.
--Commented out for safety.

DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
	userID INTEGER NOT NULL PRIMARY KEY,
	username VARCHAR(100),
    passwordFieldToUpdate VARCHAR(100),
    firstName VARCHAR(100),
	lastName VARCHAR(100),
	dateOfBirth DATE,
    avatarImage VARCHAR(500),
    authToken VARCHAR(128)
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
	commentDate TIMESTAMT DEFAULT CURRENT_TIMESTAMP,
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
	
--users(userID, username, passwordFieldToUpdate, firstName, lastName, dateOfBirth)
INSERT INTO users (userID, username, passwordFieldToUpdate, firstName, lastName, dateOfBirth) VALUES
   (1, 'enigmaCracker', 'password', 'Alan', 'Turing', '1912-06-23'),
   (2, 'theAdmiral', 'password', 'Grace', 'Hopper', '1906-12-09'),
   (3, 'don', 'password', 'Donald', 'Knuth', '1938-01-10');

---articles(articleID, title, publishDate, lastEditDate, bodyContentOrLinkToContent, *authorID*)
INSERT INTO articles VALUES
   (1, 'How I beat the Nazis', '1950-04-18', '1950-04-19', 'This is some article text https://en.wikipedia.org/wiki/Alan_Turing', 1),
   (2, 'Coding on Boats: A how to guide', '1960-08-08', '1960-08-08', 'This is some article text https://en.wikipedia.org/wiki/Grace_Hopper', 2),
   (3, 'Why I quit email an dyou should too', '1984-03-28', '1984-03-28', 'This is some article text https://www-cs-faculty.stanford.edu/~knuth/email.html', 3);

   --comments(commentID, commentDate, commentText, commentLevel, parentComment, *authorID*, *parentArticleID* )
INSERT INTO comments VALUES
   (1, '2010-04-20', 'This is the first comment', 0, null, 2, 1),
   (2, '2011-04-20', 'This is the second comment', 0, null, 2, 2),
   (3, '2012-04-20', 'This is the third comment', 0, null, 2, 3);

--votes(*userID*, *commentID*, voteValue)
INSERT INTO votes VALUES
   (1,1,1),
   (1,2,-1),
   (2,3,1);