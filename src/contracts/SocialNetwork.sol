
// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract SocialNetwork {
    string public name;
    uint public postCount = 0;
    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address sender;
        address payable author;
        uint commentCount;
        //mapping(uint => string) comments;
        //string[] comment;
        string comment;
    }

    /*struct Comment {
        string content;
        uint timestamp;
        address sender;
    }*/

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address sender,
        address payable author,
        uint commentCount
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event AddComment(
        string content,
        uint id
    );
    constructor() public {
        name = "MESH MINDS";
    }

    function createPost(string memory _content) public {
        // Require valid content
        require(bytes(_content).length > 0);
        // Increment the post count
        postCount ++;
        // Create the post
        posts[postCount] = Post(postCount, _content, 0, msg.sender, msg.sender, 0, "");
        // Trigger event
        emit PostCreated(postCount, _content, 0, msg.sender, msg.sender, 0);
    }

    function rePost(string memory _content, address payable _owner) public {
        // Require valid content
        require(bytes(_content).length > 0);
        // Increment the post count
        postCount ++;
        // Create the post
        posts[postCount] = Post(postCount, _content, 0, msg.sender, _owner, 0, "");
        // Trigger event
        emit PostCreated(postCount, _content, 0, msg.sender, _owner, 0);
    }

    function tipPost(uint _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount);
        // Fetch the post
        Post memory _post = posts[_id];
        // Fetch the author
        address payable _author = _post.author;
        // Pay the author by sending them Ether
        _author.transfer(msg.value);
        // Incremet the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update the post
        posts[_id] = _post;
        // Trigger an event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }
    function commentPost(uint _id, string memory _comment) public {
        require(bytes(_comment).length > 0);
        //Post storage _post = posts[_id];
        posts[_id].commentCount+=1;
        //_post.commentCount++;
        //_post.comments[_post.commentCount]=_content;
        //posts[_id].comments[posts[_id].commentCount] = _content;
        //posts[_id].comment.push(_comment);
        posts[_id].comment = _comment;
        emit AddComment(_comment, _id);
    }
}
