import React from "react";
import loading from "../assets/loading.svg";
import './Loading.css';

const Loading = (props) => (
  <div className="container"> 
    <div className="loading-container">
      <img src={loading} alt="Loading" />
    </div>
    <br></br>
    <div>Redirecting to the {props.page} page ...</div>
  </div>
);

export default Loading;