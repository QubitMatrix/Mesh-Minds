import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    return (
      <div id="mainpage" className="container-fluid mt-5 bg-dark">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const content = this.postContent.value
                  this.props.createPost(content)
                }}>
                <div className="form-group mr-sm-2">
                  <input
                    id="postContent"
                    type="text"
                    ref={(input) => { this.postContent = input }}
                    className="form-control"
                    placeholder="What's The Tea?"
                    required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Share</button>
              </form>
              <p>&nbsp;</p>
              { this.props.posts.map((post, key) => {
                return(
                  <div>
                  
                  <div className="card mb-4 bg-dark border-light text-light" key={key} >
                    <div className="card-header bg-dark border-light">

                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                      />
                      <small className="text-white"><b>Author: </b>{post.author}</small> <br/>
                      <small className="text-light"><b>Sender: </b>{post.sender}</small>
                    </div>
                    <ul id="postList" className="list-group list-group-flush">
                      <li className="list-group-item bg-dark text-light">
                        <p>{post.content}</p>
                      </li>
                      <li key={key} className="list-group-item py-2 bg-dark border-light">
                        <small className="float-left mt-1 text-muted">
                          ❤️ {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        <button
                          className="btn bg-info btn-sm float-right pt-0"
                          name={post.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.tipPost(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH 
                        </button>
                        <br/>
                        <form onSubmit={(event) => {
                          event.preventDefault()
                          const comment = this.postComment.value
                          console.log(post.id,comment);
                          this.props.addComment(post.id, comment)
                        }}>
                          <br/>
                        <input
                          id="postComment"
                          type="text"
                          ref={(input) => { this.postComment = input }}
                          className="form-control"
                          placeholder="What do you think?"
                          required />
                          <br/>
                        <button type="submit" className="btn btn-sm pt-0 bg-info" onClick = {(event) => {
                          console.log(this.postComment.value, post.id)
                        }}>➕</button>
                        </form>
                        <br/>
                        <p className='text-light'>Comments</p>
                        <button className='btn btn-sm pt-0 bg-info' onClick={(event) => {
                          let count=0;
                          while(count<post.commentCount)
                          {
                            this.props.getComment(post.id,count)
                            count++;
                          }

                        }}>Get Comments</button>
                        { this.props.commentss.map((comment,key) => {return(<div className='text-white shadow p-2'><p>{comment}</p></div>)})}
                        <br/><br/>
                        <button className='btn btn-sm pt-0 bg-info' onClick={(event) => {
                          event.preventDefault()
                          const content = post.content
                          const sender = post.author
                          this.props.rePost(content, sender)
                        }}>Repost</button>
                      </li>
                    </ul>
                  </div>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
