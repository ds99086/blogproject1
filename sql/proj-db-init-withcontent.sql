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
   (2, 'salesForceField', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'Marc', 'Benioff', '1964-09-25', '02', null, 0, 'I made sales force and lots of $'),
   (3, 'datacomDude', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'Bernard', 'Battersby', '1990-01-01', '03', null, 0, 'this user does not yet have an introduction'),
   (4, 'enigmaCracker', '$2b$10$rQAvdV7Ka58JUxUx5siKsusBcEF71QDmfsChx6B39reCfD2.FdxbS', 'Alan', 'Turing', '1912-06-23', '01', null, 0, ''),
   (5, 'theAdmiral', '$2b$10$rQAvdV7Ka58JUxUx5siKsusBcEF71QDmfsChx6B39reCfD2.FdxbS', 'Grace', 'Hopper', '1906-12-09', '02', null, 0, ''),
   (6, 'don', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'Donald', 'Knuth', '1938-01-10', '03', null, 0, ''),
   (7, 'SerkoGetsYouThere', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '03', null, 0, 'this user does not yet have an introduction'),
   (8, 'DoNoEvil', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '03', null, 0, 'this user does not yet have an introduction'),
   (9, 'Windows4Ever', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'Bill', 'Gates', '1990-01-01', '03', null, 0, 'this user does not yet have an introduction'),
   (10, 'username10', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '03', null, 0, 'this user does not yet have an introduction'),
   (11, 'username11', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '03', null, 0, 'this user does not yet have an introduction'),
   (12, 'username12', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '03', null, 0, 'this user does not yet have an introduction'),
   (13, 'username13', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '03', null, 0, 'this user does not yet have an introduction'),
   (14, 'username14', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '03', null, 0, 'this user does not yet have an introduction'),
   (15, 'username15', '$2b$10$XTa37RWjSnaO87oB1udvueZW0w6cj/l3KjTI4Yled0miNpoiWoTqq', 'fname', 'lname', '1990-01-01', '03', null, 0, 'this user does not yet have an introduction');
 

--articles(articleID, title, publishDate, lastEditDate, bodyContentOrLinkToContent, *authorID*)
INSERT INTO "articles" VALUES (1,'Work with Serko','2021-01-23','2021-05-27 22:39:37','

            Serko may be a technology company, but its core strength is its people. With around 250 employees (Serkodians) worldwide and aggressive growth ambitions, our culture reflects the diversity of our people centred around our core values.<div><br></div><div><div><span style="color: rgb(35, 31, 32); font-size: 20px;">Serko Values</span></div><div>&nbsp;</div><div><ol><li>Mastery<br>Serkodians continuously strive to become masters of what they do</li><li>Autonomy<br>Serkodians are able to work independently and make decisions for themselves</li><li>Teamwork<br>Serkodians work well with people not just in their own teams, but in teams across the organisation</li><li>Pasison<br>Serkodians are passionate about what they do and what Serko does</li><li>Integrity<br>Serkodians are honest, respectful of others, deliver on their commitments and make ethical business decisions</li><li>Family<br>Serkodians are valued as part of the Serko family and Serko recognises the importance of their families to them</li></ol></div>&nbsp;

            <div id="bodyHintText"></div>

        <div><br></div><div><div class="row-fluid-wrapper row-depth-1 row-number-4 " style="margin: 0px; padding: 0px; box-sizing: border-box; border: 0px; outline: 0px; text-align: center; background-color: rgb(255, 255, 255); font-size: 14px; font-family: Barlow, sans-serif; color: rgb(0, 0, 0);"><div class="row-fluid " style="margin: 0px; padding: 0px; box-sizing: border-box; border: 0px; outline: 0px; width: 893px;"><br></div></div><div class="row-fluid-wrapper row-depth-1 row-number-1 " style="margin: 0px; padding: 0px; box-sizing: border-box; border: 0px; outline: 0px; font-size: 14px; color: rgb(0, 0, 0); font-family: Barlow, sans-serif; text-align: center; background-color: rgb(255, 255, 255);"></div></div>

        </div>',7),
 (2,'Careers at Datacom','2021-06-16','2021-06-03 22:11:37','

                        <img src="userUploads/user_4/CareersHomepageAlternate-Hero-Image-1920x560px@2x.jpg" width="400"><br><br>    <div><h1>Smart minds create smart technology.</h1></div><div>Get more than just a career at Datacom. With us, you get an opportunity to be part of a community of innovators, explorers, and dreamers, and a chance to create your future and the future of technology.</div><div><br></div><div>As Australasia''s largest homegrown tech company, the IT systems we build and run are shaping the world and connecting people and technology like never before. We work across multiple industries, from&nbsp; to , to create diverse, cutting-edge, and sustainable solutions to help our customers better connect with theirs.</div><div><br></div><div>From&nbsp; to , we’re committed to developing, retaining, and promoting diverse talent. We want to help you grow your current skills and give you the opportunity to learn and develop brand new ones.</div><div><br></div><div>Be part of the Datacom community. Work with the best people of today to create the best IT of tomorrow.</div><div><br></div><div><h2><br></h2><h2>Our people. Our difference.</h2>A career at Datacom is more than just computers and technology. With offices across the globe and people from every background, Datacom is a community of diverse people, with imaginative ideas and inspirational stories. Explore the lives of just four of our people and see what inspires them to achieve their best work.<br></div><div><br></div><div><div><h2>Why Datacom?</h2><div><div>Behind every great IT company, there are greater people.</div><div>We celebrate equality, diversity, and achievement with our people from all corners of the world. We believe in hiring people who care just as much for each other as they do about their work.</div><div><br></div><div>Your career at Datacom, just like technology, has endless possibilities. From using next-generation technology to helping government agencies and multinational partners, no two projects will ever be the same. Flexible working, discounts, health and wellbeing offers, and social events are just some of the other benefits at Datacom.</div></div></div></div><div><br></div>            <div id="bodyHintText"></div>                

        ',3),
 (3,'Xero Values','2021-06-04','2021-06-03 22:33:09','<img src="http://localhost:3000/userUploads/user_4/XeroFuture.png" width="400"><br><br><div><div>&nbsp;<h1>Our values. What we believe in</h1></div><div><br></div><div><h2>Human</h2></div><div>Xeros are authentic, inclusive and really care.&nbsp;</div><div><br></div><div>We are kind and assume best intent. Inclusive, approachable and show empathy. Willing to be vulnerable, share&nbsp; fears, failures and learnings.</div><div><br></div><div>&nbsp;</div><div><br></div><div><h2>Challenge</h2></div><div>Xeros dream big, lead and embrace change.</div><div><br></div><div>We are curious and think big. Welcome challenging conversations and do it with respect. Lead and embrace change, seeking new and better ways.</div><div><br></div><div>&nbsp;</div><div><br></div><div><h2>Team</h2></div><div>Xeros are great team players.</div><div><br></div><div>We champion Xero’s purpose and priorities. Work together to do what’s best for Xero and our customers. Appreciate and celebrate each other and success.</div><div><br></div><div>&nbsp;</div><div><br></div><div>&nbsp;</div><div><br></div><div><h2>Ownership</h2></div><div>Xeros deliver on our commitments.</div><div><br></div><div>We do what we say we will do. Own our mistakes and take positive action. Move fast to get the right things done.</div><div><br></div><div>&nbsp;</div><div><br></div><div><h2>Beautiful</h2></div><div>Xeros create experiences that people love.</div><div><br></div><div>We create experiences that inspire and delight. Do high quality work. Go the extra mile.</div></div>

            <div id="bodyHintText"></div>

        ',1),
 (4,'Discover Your Ideal Career In The Cloud','2021-06-04','2021-06-03 22:55:21','

            <img src="userUploads/user_4/SalesForce.png" width="400"><br><br>

    <div><h2></h2><h3>Why Salesforce?</h3></div><div>A career at Salesforce is more than just a job — it’s an opportunity to shape the future. Our company was built on a set of four core values which make that possible: trust, customer success, innovation, and equality. At Salesforce, we harness technologies that revolutionize careers, companies, and the world. Join us to discover a future of opportunities.</div><div>&nbsp;<h3>We’re better together.</h3></div><div>At Salesforce, we’re dedicated to building a workforce that reflects the diverse communities we serve and where everyone feels empowered to bring their full, authentic selves to work. Our values aren’t just words on a page — we learn to live them every day, measure our success, and continuously evolve. Together, we’re on a mission to improve the state of the world.&nbsp;</div><div>astro and einstein helping a candidate</div><div>&nbsp;</div><div><br></div><div><h3>Get taken care of.</h3></div><div>When you join Salesforce, you join a global family. And we take care of each other. Our incredible benefits protect and improve the lives of our employees and their families. They enhance everyday wellbeing, help you save for now and later, encourage you to take time off work, and provide amazing discounts.</div><div><br></div>

            <div id="bodyHintText"></div>

        

        ',2),
 (5,'for everyone - your next job at google','2021-06-04','2021-06-03 22:58:42','<div><br></div>            <div><h1 style="font-family: &quot;Google Sans Display&quot;, Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); line-height: 1.2em; font-size: 3vw; box-sizing: border-box; margin: 0px auto; padding: 0px; font-weight: 400; text-rendering: optimizelegibility; -webkit-font-smoothing: antialiased; letter-spacing: -0.03125rem; width: 594.078px; text-align: center; background-color: rgb(255, 255, 255);">Our mission is to&nbsp;<span class="blue" style="color: rgb(66, 133, 244); box-sizing: border-box;">organise</span>&nbsp;the world’s&nbsp;<span class="red" style="color: rgb(234, 67, 53); box-sizing: border-box;">information</span>&nbsp;and make it&nbsp;<span class="green" style="color: rgb(52, 168, 83); box-sizing: border-box;">universally accessible</span>&nbsp;and&nbsp;<span class="yellow" style="color: rgb(249, 171, 0); box-sizing: border-box;">useful</span>.</h1></div><img src="userUploads/user_4/Google.png" width="400"><div><br></div><div><br><div><h1 style="box-sizing: border-box; font-size: 6vw; margin: 0px auto; padding: 0px; font-weight: 400; text-rendering: optimizelegibility; -webkit-font-smoothing: antialiased; font-family: &quot;Google Sans Display&quot;, Arial, Helvetica, sans-serif; letter-spacing: -0.03125rem; color: rgb(0, 0, 0); line-height: 1.2em; width: 594.078px; text-align: center; background-color: rgb(255, 255, 255);"><br></h1><div><div>Protecting users</div><div>Every day Google keeps billions of people safer online. We protect our users with industry-leading security, responsible data practices, and easy-to-use privacy controls.<br><br><div>Find your team</div><div>Together, we create access to information and build products for everyone. Want to be a Googler? Find your team.</div></div></div><div><br></div><div><br></div><div><br></div><div><br><br>                <div id="bodyHintText"></div>                </div></div></div>',8);

	
--comments(commentID, commentDate, commentText, commentLevel, parentComment, *authorID*, *parentArticleID* )
INSERT INTO "comments" VALUES (1,'2021-06-01 23:10:09','This is the first comment, no parent, article 1',0,0,4,1),
 (2,'2021-06-03 23:01:29','Eh, you''re just trying to copy me!',0,0,9,4),
 (3,'2021-06-03 23:01:48','No we''re not! We''re totally our own thing :)',1,2,2,4),
 (4,'2021-06-03 23:01:58','How secure are your passwords?',0,0,4,4),
 (5,'2021-06-03 23:06:11','So how''s that do no evil thing working out?',0,0,1,5),
 (6,'2021-06-03 23:06:24','No evil to see here!',1,5,8,5),
 (7,'2021-06-03 23:06:41','What about those emails to evil corp?',2,6,4,5),
 (8,'2021-06-03 23:06:51','How are you reading my emails!?!',2,6,8,5);
-- votes(*userID*, *commentID*, voteValue)
INSERT INTO votes VALUES
	(1, 1, 1);
   
--articleVotes (*userID*, *articleID*, voteValue)	