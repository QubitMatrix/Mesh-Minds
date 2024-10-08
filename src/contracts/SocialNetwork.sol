
// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

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
        string path;
        mapping(uint=>Comment) comments;
    }

    struct Comment {
        string message;
        uint timestamp;
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address sender,
        address payable author,
        uint commentCount,
        string path
    );

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event AddComment(
        uint id,
        string content,
        uint timestamp
    );

    event AddPath(
        uint id,
        string path
    );

    constructor() public {
        name = "MESH MINDS";
    }

    function createPost(string memory _content) public {
        // Require valid content
        require(bytes(_content).length > 0);
        // Increment the post count
        postCount ++;
        Comment memory _comment = Comment("", 0);
        // Create the post
        posts[postCount] = Post(postCount, _content, 0, msg.sender, msg.sender, 0, "");
        // Trigger event
        emit PostCreated(postCount, _content, 0, msg.sender, msg.sender, 0, "");
    }

    function rePost(string memory _content, address payable _owner, string memory path) public {
        // Require valid content
        require(bytes(_content).length > 0);
        // Increment the post count
        postCount ++;
        Comment memory _comment = Comment("", 0);
        // Create the post
        posts[postCount] = Post(postCount, _content, 0, msg.sender, _owner, 0, path);
        // Trigger event
        emit PostCreated(postCount, _content, 0, msg.sender, _owner, 0, path);
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
        posts[_id].comments[posts[_id].commentCount].message = _comment;
        posts[_id].comments[posts[_id].commentCount].timestamp = block.timestamp;
        posts[_id].commentCount+=1;
        emit AddComment(_id, posts[_id].comments[0].message, posts[_id].comments[0].timestamp);
    }

    function getComment(uint _id, uint count) public returns(string memory)
    {
        return (posts[_id].comments[count].message);
    }

    function addIPFSPath(string memory path) public 
    {
        posts[postCount].path=path;
        emit AddPath(postCount, posts[postCount].path);
    }
}
