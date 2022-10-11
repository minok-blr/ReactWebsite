import { useEffect, useState, useContext } from 'react';
import {Link, Navigate} from "react-router-dom";
import { UserContext } from '../userContext';
import Photos from './Photos.js';

var voted = false;
function userInArray(listOfUsers, username){
    listOfUsers.forEach(el => {
        if(el.username == username){
            return true;
        }
    });
    return false;
}

function Photo(props){
    const userContext = useContext(UserContext);
    const [likes, setLikes] = useState(props.photo.likes);

    async function report(e){
        e.preventDefault();
        var urlstr = "http://localhost:3001/photos/report/"+props.photo._id;
        console.log(urlstr);

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };
        const res = await fetch(urlstr, requestOptions);
        const data = await res.json();
        console.log(data);

    }

    async function rate(e){
        e.preventDefault();
        var selection = e.target.getAttribute('name');
        var isUp = false;
        if(selection == "up") isUp = true;
        else isUp = false;

        var urlstr = "http://localhost:3001/photos/" + (isUp ? "up/": "down/") + props.photo._id;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title: (isUp ? 'up' : 'down'), userID: userContext.user._id})
        };
        const res = await fetch(urlstr, requestOptions);
        const data = await res.json();

        console.log(" what: "+ (isUp && voted));
        if(!voted){
            if(isUp){
                setLikes(likes+1);
            }
            else{
                setLikes(likes-1);
            }
            voted = true;
        }
    }
    return (
        <>
        <div className="col col-md-3">
        <div className="card text-dark mb-2" style={{width: '22rem'}}>
            <img className="card-img"  style={{width: '22rem', height: '10rem'}} src={"http://localhost:3001/"+props.photo.path} alt={props.photo.name}/>
            <div className="card-body">
                <h5 className="card-title">{props.photo.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">posted by: {props.photo.postedBy.username} on {props.photo.createdAt}</h6>
                <p className="card-text">Some quick example text on the card title to make up the content.</p>

                <div>
                    <p>Tags:</p>
                    {props.photo.tags.map((tag, i)=>
                        {return (
                            <Link to={"/photos/tag/"+tag} key={i}>
                                <div key={i} className="btn btn-primary">{tag}</div>
                            </Link>)
                                                            }
                                        )
                    }
                </div>
                <br/>

                {userContext.user ? (
                    <div>
                    <div className="btn btn-primary" name="up" onClick={rate}>Like</div>
                        &nbsp;&nbsp; {likes} &nbsp;&nbsp;
                            <div className="btn btn-danger" name="down" onClick={rate}>Dislike</div>
                        <br/><br/>
                        <Link to={"/photos/"+props.photo._id}>
                            <div className="btn btn-primary">See more</div>
                        </Link>
                        <div className="btn btn-danger" onClick={report}>Report</div>
                    </div>
                ) : ( <>Rating: <h6>{props.photo.likes}</h6> &nbsp;&nbsp;</>)}
            </div>
        </div>
        </div>
    </>
    );
}

export default Photo;