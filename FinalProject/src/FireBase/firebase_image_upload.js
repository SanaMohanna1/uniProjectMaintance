import React, { useEffect, useState } from "react";
import { imagedb } from "./Config";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";

function FirebaseImageUpload(){
    const [img,setImg] =useState('')
    const [imgUrl,setImgUrl] =useState([])

     

    useEffect(()=>{
        listAll(ref(imagedb,"candles")).then(imgs=>{
            console.log(imgs)
            imgs.items.forEach(val=>{
                getDownloadURL(val).then(url=>{
                    setImgUrl(data=>[...data,url])
                })
            })
        })
    },[])

    useEffect(()=>{
        if(imgUrl)
         console.log(imgUrl.length);
    },[])


    return(
        <div className="App">
                <input type="file" onChange={(e)=>setImg(e.target.files[0])} /> 
                <br/>
                {
                    imgUrl.map(dataVal=><div>
                        <img src={dataVal} height="200px" width="200px" />
                        <br/> 
                    </div>)
                }
        </div>
    )
}
export default FirebaseImageUpload;