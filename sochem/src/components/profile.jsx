import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Navbar from './navbar';
import logo from './images/me.jpeg';
import Comment from './forum-comment';
var FontAwesome = require('react-fontawesome');

var gotAllForm = false;
var gotAllComment = false;
var gotCommentCount = false;

function Profile(){

    const [user, setUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [token, setToken] = useCookies(['mr-token']);
    const [forumPost, setForumPost] = useState([]);
    const [showComment, setShowComment] = useState(null);
    const [forumComment, setForumComment] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    useEffect(()=>{
        fetch('http://127.0.0.1:8000/api/user-from-token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token['mr-token']}`,
            },
            body: JSON.stringify({
                'token': `${token['mr-token']}`,
            })
            }).then( resp => resp.json()).then(res => setUser(res))
            .catch( error => console.log(error)) 
    },[])

    const toggleComment = id =>{

        if(showComment===id) setShowComment(null);
        else setShowComment(id);
    }

    const getUserDetail = () =>{
        //console.log(user);
        if(userDetail==null && user){
            fetch(`http://127.0.0.1:8000/api/user-extension?id=${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token['mr-token']}`,
                }
                }).then( resp => resp.json()).then(res => setUserDetail(res))
                .catch( error => console.log(error))
        }
    }
    const getAllForum = () =>{
        if(user && (gotAllForm == false)){
            gotAllForm = true;
            fetch(`http://127.0.0.1:8000/api/forum-post?id=${user.id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Token ${token['mr-token']}`
                }
              }).then( resp => resp.json())
              .then( res => {
                  setForumPost(res);
                })
              .catch( error => console.log(error));
        }
    }
    const getCommentCount = () =>{
        if(user && (gotCommentCount==false)){
            gotCommentCount = true;
            fetch(`http://127.0.0.1:8000/api/total-comments?user_id=${user.id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Token ${token['mr-token']}`
                }
              }).then( resp => resp.json()).then(res => setCommentCount(res))
              .catch( error => console.log(error));
        }
    }

    const getAllComment = () =>{
        if(user && (gotAllComment==false)){
            gotAllComment = true;
            fetch(`http://127.0.0.1:8000/api/forum-comment?user_id=${user.id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Token ${token['mr-token']}`
                }
              }).then( resp => resp.json())
              .then( res => {
                  setForumComment(res);
                })
              .catch( error => console.log(error));
        }
    }

    return (
        
        <div>  
            <Navbar/>
            {getUserDetail()}
            {getAllForum()}
            {getAllComment()}
            {getCommentCount()}
            <div style={{marginTop:95}} className="container">
                <div className="row pt-5 pl-0">
                    <div className="col-11 ml-0 col-md-4">
                        <div className="card border card-profile-main rounded p-3">
                            <img className="card-img-top image-card-profile-main" src={logo} alt="Card image cap"/>
                                <div className="card-body">
                                    <h3 className="card-title mb-4">{user && user.first_name} {user && user.last_name}</h3>
                                    <h5><FontAwesome name="info-circle"/> {userDetail && userDetail[0].batch}</h5>
                                    <h5><FontAwesome name="at"/> {user && user.email}</h5>
                                    <hr></hr>
                                    <p className="card-text"> <FontAwesome name="quote-left"/> {userDetail && userDetail[0].bio} <FontAwesome name="quote-right"/></p>
                                </div>
                        </div>
                        <div className="p-3 card-profile-main border mt-4">
                            <h2>Stats</h2>
                            <hr></hr>
                            <div className="row">
                                <div className="col-9">
                                    <h5>Your total posts: </h5>
                                    <h5>Your total comments: </h5>
                                    <h5>Comment on your posts: </h5>
                                </div>
                                <div className="col-3">
                                    <h5>{forumPost.length}</h5>
                                    <h5>{forumComment.length}</h5>
                                    <h5>{commentCount}</h5>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-11 col-md-7 ml-auto mr-auto mt-3 mt-md-0  rounded">
                        <div className="border p-3">
                            <h2 className="mt-2 mb-3">Your posts :</h2>
                            <hr></hr>
                                    <div>
                                            {forumPost.map((post, index) => {
                                                return (
                                                    <div className="rounded p-1" key={post.id}>
                                                        <div className="jumbotron p-1 mb-1 mt-1 bg-dark">
                                                            <h4 className="text-light">{post.heading}</h4>
                                                        </div>
                                                        <h5 className="jumbotron p-2 mb-2">
                                                                {post.body}
                                                        </h5>
                                                        <span className="mb-5">
                                                        <h3 className="text-warning" onClick={()=>toggleComment(post.id)}><FontAwesome name="comment"/>
                                                        <span className="ml-2 text-dark">{showComment==post.id ? <FontAwesome name="arrow-up"/> : <FontAwesome name="arrow-down"/>}</span>
                                                        </h3>
                                                        
                                                        {showComment==post.id ? <Comment postId={post.id} user={user} allAdd={false}/> : null}
                                                        </span>
                                                        <hr></hr>
                                                        
                                                    </div>   
                                                );
                                            })}
                                    </div>
                        </div>
                        <div className="border mt-4">
                            <h2 className="m-3">Your Comments:</h2>
                            <hr></hr>
                            {forumComment.map(comment =>{
                                return(
                                    <div id="profile-comment-all" className="p-3 rounded">
                                        <h5><FontAwesome name="comment"/> {comment.comment}</h5>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
export default Profile;