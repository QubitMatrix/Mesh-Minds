import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Main from './Main'
import { create } from "ipfs-http-client";

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({account: null})
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      // Load Posts
      for (var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      // Sort posts. Show highest tipped posts first
      this.setState({
        posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false})
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }

  createPost(content) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  rePost(content, author) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.rePost(content, author).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  tipPost(id, tipAmount) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  addComment(id, comment)
  {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.commentPost(id, comment).send({ from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  getComment(id, count)
  {
    this.state.socialNetwork.methods.getComment(id, count).call().then((comment)=>{console.log(count+comment); this.setState({comment: [...this.state.comment, comment]})})
  }

  addIPFSPath(path)
  {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.addIPFSPath(path).send({ from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true,
      comment: []
    }

    this.createPost = this.createPost.bind(this)
    this.rePost = this.rePost.bind(this)
    this.tipPost = this.tipPost.bind(this)
    this.addComment = this.addComment.bind(this)
    this.getComment = this.getComment.bind(this)
    this.addIPFSPath = this.addIPFSPath.bind(this)
  }

  render() {
    
    return (
      <div>
        <Navbar account={this.state.account} />
        <input class="login-address" type="text" placeholder="address" name="address" onBlur={(event)=>{event.preventDefault(); console.log("abc"+event.target.value); this.setState({ account: event.target.value }); document.getElementById("mainpage").style.display="block";}}/>
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              posts={this.state.posts}
              commentss={this.state.comment}
              createPost={this.createPost}
              rePost={this.rePost}
              tipPost={this.tipPost}
              addComment={this.addComment}
              getComment={this.getComment}
              addIPFSPath={this.addIPFSPath}
            />
        }
      </div>
    );
  }
}

export default App;
