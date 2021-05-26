const commentArray = [
    {
      "commentID": 1,
      "commentDate": "2010-04-20",
      "commentText": "This is the first comment, no parent, article 1",
      "commentLevel": 0,
      "parentComment": "",
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 2,
      "commentDate": "2011-04-20",
      "commentText": "This is the second comment, no parent, article 1",
      "commentLevel": 0,
      "parentComment": "",
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 3,
      "commentDate": "2012-04-20",
      "commentText": "This is the third comment, replies to the first comment, article 1",
      "commentLevel": 1,
      "parentComment": 1,
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 4,
      "commentDate": "2010-04-20",
      "commentText": "This is the fourth comment, replies to the second comment, article 1",
      "commentLevel": 1,
      "parentComment": 2,
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 5,
      "commentDate": "2011-04-20",
      "commentText": "This is the fifth comment, replies to the third comment, article 1",
      "commentLevel": 2,
      "parentComment": 3,
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 6,
      "commentDate": "2012-04-20",
      "commentText": "This is the sixth comment, replies to the first comment, article 1",
      "commentLevel": 1,
      "parentComment": 1,
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 7,
      "commentDate": "2010-04-20",
      "commentText": "This is the seventh comment, replies to the fourth comment, article 1",
      "commentLevel": 2,
      "parentComment": 4,
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 8,
      "commentDate": "2011-04-20",
      "commentText": "This is the eigth comment, replies to the second comment, article 1",
      "commentLevel": 1,
      "parentComment": 2,
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 9,
      "commentDate": "2012-04-20",
      "commentText": "This is the ninth comment, replies to the second coment, article 1",
      "commentLevel": 1,
      "parentComment": 2,
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 10,
      "commentDate": "2010-04-20",
      "commentText": "This is the tenth comment, no parent, article 1",
      "commentLevel": 0,
      "parentComment": "",
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 11,
      "commentDate": "2011-04-20",
      "commentText": "This is the elevnth comment, no parent, article 1",
      "commentLevel": 0,
      "parentComment": "",
      "authorID": 2,
      "parentArticleID": 1
    },
    {
      "commentID": 12,
      "commentDate": "2012-04-20",
      "commentText": "This is the twelth comment, replies to the 10th comment, artcile 1",
      "commentLevel": 1,
      "parentComment": 10,
      "authorID": 2,
      "parentArticleID": 1
    }
   ];

let originalOrder = "original_order_"
commentArray.forEach(comment => {
  originalOrder += comment.commentID+"_";
})
console.log(originalOrder);

console.log("this simply sorts the comments");
let sortedComments = "display_order_";

function addChildren(parentComment, sourceArray, targetArray) {
  sourceArray.forEach(element => {
    if (parentComment.commentID == element.parentComment) {
      console.log("comment "+element.commentID+" is a child of "+parentComment.commentID)
      sortedComments += element.commentID+"_";
      addChildren(element, sourceArray, targetArray);
    }
  });
}

commentArray.forEach(comment => {
  if (comment.commentLevel == 0) {
    console.log("comment "+comment.commentID+" is a level 0 comment")
    sortedComments += comment.commentID+"_";
    addChildren(comment, commentArray, sortedComments);
  }
});

console.log(sortedComments);