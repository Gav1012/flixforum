import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Axios from 'axios'

// Credit for the overall like/dislike button logic found here:
// https://timetoprogram.com/create-like-dislike-button-react-js/

const LikeButton = ({forum_id, post_id, user_id, login}) => {
  console.log("login status " + login)
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const [activeBtn, setActiveBtn] = useState("none");

  const navigate = useNavigate();

  // retrieve the current number of likes and dislikes
  useEffect(()=>{
    Axios.post("http://localhost:3001/totalLikes", {
      post_id: post_id,
    }).then((response) => {
        if(response.data.message) {
            console.log(response.data.message);
        } else {
            setLikeCount(response.data[0].likes)
            console.log(response)
        }
    });
  });

  useEffect(()=>{
    Axios.post("http://localhost:3001/totalDislikes", {
      post_id: post_id,
    }).then((response) => {
      if(response.data.message) {
          console.log(response.data.message);
      } else {
          setDislikeCount(response.data[0].dislikes)
          console.log(response)
      }
    });
  });

  useEffect(()=>{
    Axios.post("http://localhost:3001/buttonStatus", {
      forum_id: forum_id,
      post_id: post_id,
    }).then((response) => {
      if(response.data.message) { // post isn't in post_likes table yet
          console.log(response.data.message);
          setActiveBtn('none');
      } else {
          // update the button status based on the query
          const like_status = response.data[0].like
          const dislike_status = response.data[0].dislike
          if (like_status === 0 && dislike_status === 0) {
            setActiveBtn('none')
          } else if (like_status === 1 && dislike_status === 0) {
            setActiveBtn('like')
          } else if (like_status === 0 && dislike_status === 1) {
            setActiveBtn('dislike')
          } else {
            setActiveBtn('none')
          }
          console.log(response)
      }
    });
  });
  console.log(activeBtn);
  // handle all the logic when pressing like button and all the diff cases
  const handleLikeClick = () => {
    if (activeBtn === "none") {
      // update the DB
      Axios.post("http://localhost:3001/addLike", { 
        post_id: post_id,
      }).then((response) => {});
      setLikeCount(likeCount + 1);
      // add user to likes table (if not already in table) and set the like column to 1 and dislikes 0
      Axios.post("http://localhost:3001/insertPost", { 
        post_id: post_id,
        user_id: user_id,
        forum_id: forum_id,
        like_value: 0,
        dislike_value: 0,
      }).then((response) => {
        Axios.post("http://localhost:3001/updatePostsLikes", { 
        post_id: post_id,
        forum_id: forum_id,
        like_value: 1,
        dislike_value: 0,
        user_id: user_id,
      }).then((response) => {})});
      setActiveBtn("like");
    }

    if (activeBtn === 'like'){ // take away a like if the user presses the like button again
      Axios.post("http://localhost:3001/subLike", {
        post_id: post_id,
      }).then((response) => {});
      setLikeCount(likeCount - 1);
      // set the like column to 0 
      // set the dislike column to 0
      Axios.post("http://localhost:3001/updatePostsLikes", { 
        post_id: post_id,
        user_id: user_id,
        like_value: 0,
        dislike_value: 0,
      }).then((response) => {})
      setActiveBtn("none");
      //console.log(response)
    }

    if (activeBtn === "dislike") {
      // update the DB
      Axios.post("http://localhost:3001/addLike", {
        post_id: post_id,
      }).then((response) => {});
      setLikeCount(likeCount + 1);
      Axios.post("http://localhost:3001/subDislike", {
        post_id: post_id,
      }).then((response) => {});
      setDislikeCount(dislikeCount - 1);
      // set the liked column to 1 and the disliked column to 0
      Axios.post("http://localhost:3001/updatePostsLikes", { 
        post_id: post_id,
        user_id: user_id,
        like_value: 1,
        dislike_value: 0,
      }).then((response) => {})
      setActiveBtn("like");
      //console.log(response)
    }
  };

  // handle all the logic when pressing dislike button and all the diff cases
  const handleDisikeClick = () => {
    if (activeBtn === "none") {
      // update the DB
      Axios.post("http://localhost:3001/addDislike", {
        post_id: post_id,
      }).then((response) => {});
      setDislikeCount(dislikeCount + 1);
      Axios.post("http://localhost:3001/insertPost", { 
        post_id: post_id,
        user_id: user_id,
        forum_id: forum_id,
        like_value: 0,
        dislike_value: 0,
      }).then((response) => {
        Axios.post("http://localhost:3001/updatePostsLikes", { 
        post_id: post_id,
        user_id: user_id,
        like_value: 0,
        dislike_value: 1,
      }).then((response) => {})});
      setActiveBtn('dislike');
      //console.log(response)
    }
    
    if (activeBtn === 'dislike'){
      Axios.post("http://localhost:3001/subDislike", {
        post_id: post_id,
      }).then((response) => {});
      setDislikeCount(dislikeCount - 1);
      Axios.post("http://localhost:3001/updatePostsLikes", { 
        post_id: post_id,
        user_id: user_id,
        like_value: 0,
        dislike_value: 0,
      }).then((response) => {})
      setActiveBtn("none");
      //console.log(response)
    }

    if (activeBtn === "like") {
      Axios.post("http://localhost:3001/addDislike", {
        post_id: post_id,
      }).then((response) => {});
      setDislikeCount(dislikeCount + 1);
      Axios.post("http://localhost:3001/subLike", {
        post_id: post_id,
      }).then((response) => {});
      setLikeCount(likeCount - 1);
      Axios.post("http://localhost:3001/updatePostsLikes", { 
        post_id: post_id,
        user_id: user_id,
        like_value: 0,
        dislike_value: 1,
      }).then((response) => {})
      setActiveBtn("dislike");
      //console.log(response)
    }
  };


  return (
    <div className="container">
      <div className="btn-container">
      {
          (login) ?
          <>
            <button
              className={"btn ${activeBtn === 'like' ? 'like-active' : ''}"}
              onClick={handleLikeClick}  
            >
              <span className="material-symbols-rounded"></span>
              Like {likeCount}
            </button>
            
            <button
              className={"btn ${activeBtn === 'dislike' ? 'dislike-active' : ''}"}
              onClick={handleDisikeClick}
            >
              <span className="material-symbols-rounded"></span>
              Dislike {dislikeCount}
            </button>
          </>
          :
          <>
            <button
              onClick={() => navigate("/login")}  
            >
              <span className="material-symbols-rounded"></span>
              Like {likeCount}
            </button>
            
            <button
              onClick={() => navigate("/login")}
            >
              <span className="material-symbols-rounded"></span>
              Dislike {dislikeCount}
            </button>
          </>
        }
      </div>
    </div>
  );
}

export default LikeButton;