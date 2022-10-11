import { useState, useEffect } from 'react';
import Photo from './Photo';

function Popular() {
    console.log("calling popular component");
    const [photos, setPhotos] = useState([]);

    useEffect(function () {
        const getPhotos = async function(){
            const res = await fetch("http://localhost:3001/photos/popular");
            const data = await res.json();
            setPhotos(data);
        }
        getPhotos();
    },[])

    return(
        <div>
            <h3>Popular photos:</h3>
            <div className="row">
                {photos.map(photo=>(<Photo photo={photo} key={photo._id}></Photo>))}
            </div>
        </div>
    );

}

export default Popular;