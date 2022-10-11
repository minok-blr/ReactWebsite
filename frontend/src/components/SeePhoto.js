import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import {Link, Navigate, useParams} from 'react-router-dom';
import Photo from "./Photo";
import AddComment from "./AddComment";

var receivedComm = false;
var isset = false;

function SeePhoto(){
    const userContext = useContext(UserContext);
    const [photo, setPhoto] = useState({});
    const [newComment, setNewComment] = useState({});
    const { id } = useParams()
    const [comment, setComment] = useState([]);


    useEffect(function(){
        const getPhoto = async function(){
            const res = await fetch("http://localhost:3001/photos/"+id, {credentials: "include"});
            const data = await res.json();
            setPhoto(data);
        }
        getPhoto();
    }, []);

    async function PostComment(e){
        e.preventDefault();
        console.log("Clicked post comment");
        console.log(userContext.user.username);

        var urlstr = "http://localhost:3001/photos/comment/" + id;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ comment: comment,
                userID: userContext.user._id,
                username: userContext.user.username})
        };
        const res = await fetch(urlstr, requestOptions);
        const data = await res.json();
        {console.log(data)}
        receivedComm = true;
        setNewComment(data);
    }

    return (
        <>
            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            <h1 style={{textAlign: 'center'}}>Single photo</h1>
            <div className="card text-dark mx-auto" style={{width: '30rem'}}>
                <img className="card-img" style={{width: '30rem'}} src={photo.path ? "http://localhost:3001"+photo.path : "error"} alt={photo.name}/>
                <div className="card-body">
                    <h5 className="card-title">{photo.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">posted by: {photo.postedBy ? photo.postedBy.username : ""} on {photo.createdAt}</h6>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
            <br/><br/><br/>
            <h3 style={{textAlign: 'center'}}>Comment section</h3>
            <hr/>

            <div className="button-sub mx-auto" style={{width: '50rem', textAlign: 'center'}}>
                <input type="text" name="commentBox" placeholder="Comment" value={comment} onChange={(event => setComment(event.target.value))}/>
                <button className="btn btn-primary" onClick={PostComment}>Post comment
                </button>
            </div>
            <br/>

            <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"
                  integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
                  crossOrigin="anonymous"/>

            {receivedComm ? <AddComment comment={newComment} key={newComment._id} useAuthname={true}></AddComment> : ""}
            {photo.comments?.map(comment=>(<AddComment comment={comment} key={comment._id} useAuthname={false}></AddComment>))}

        </>
    );
}

export default SeePhoto;