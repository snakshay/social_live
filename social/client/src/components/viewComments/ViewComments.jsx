import axios from 'axios';
import { useEffect, useState } from 'react';
import { format } from 'timeago.js';

import './viewComment.css'

const ViewComments = (props) => {
    const [comments,setComments] = useState();

    useEffect(()=>{
        if(props.postId)
        axios.get(`${process.env.REACT_APP_BASEURL}/posts/${props.postId}/getComments`)
        .then((res)=>{
            setComments(res.data)
        })
    },[props]);
    
    return (
    <>
        {comments?
            <>
                {comments.map((e,index)=>{
                return <div className='m-10'>
                            <div className='d-flex'>
                                <img src={e.userProfile} alt='' className='img'></img> 
                                <div>
                                    <div className='userName'>

                                        {e.userName}
                                    </div>
                                    <div className="time">{format(e.createdAt)}</div>
                                    <div className="userName">{e.desc}</div>
                                </div>
                            </div>
                        </div> 
                })}
            </>
            :<></>
        }
    </> 
    );
}
 
export default ViewComments;