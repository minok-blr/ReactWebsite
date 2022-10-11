import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import {UserContext} from "../userContext";

function AddComment(props){
    return(
        <div className="container mx-auto" style={{width: '50rem'}}>
            <div className="row mx-auto">
                <div className="col-mx-auto border">
                    <div className="media g-mb-10 media-comment" style={{padding: '15px'}}>
                        <div className="media-body u-shadow-v18 g-bg-secondary g-pa-30">
                            <div className="g-mb-15">
                                <h5 className="h5 g-color-gray-dark-v1 mb-0">{props.useAuthname ? [props.comment ? props.comment.authname : ""] : [props.comment ? props.comment.author.username : ""] } {}</h5>
                                <span className="g-color-gray-dark-v4 g-font-size-12">{props.comment ? props.comment.createdAt : ""}</span>
                            </div>
                            <p>{props.comment ? props.comment.content : ""}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddComment;