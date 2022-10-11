import { useState, useEffect } from 'react';
import Photo from './Photo';
import {useParams} from "react-router-dom";

function Tagged(){
    const [photos, setPhotos] = useState([]);
    const { name } = useParams();
    console.log("ID is "+ name);
    console.log("http://localhost:3001/photos/tag/"+name);

    useEffect(function(){
        console.log("calling useEffect");
        const getPhotos = async function(){
            const res = await fetch("http://localhost:3001/photos/tag/"+name);
            const data = await res.json();
            console.log(data);
            setPhotos(data);
        }
        getPhotos();
    }, [name]);


    return(
        <div>
            <h3>Photos:</h3>
            <div className="row">
                {photos.map(photo=>(<Photo photo={photo} key={photo._id}></Photo>))}
            </div>
        </div>
    )

}

export default Tagged;