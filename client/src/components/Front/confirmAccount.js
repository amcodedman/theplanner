import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";


import { CheckCircle } from "react-bootstrap-icons";
import { CircleSpinner } from "react-spinners-kit";
import { ComfirmUserS } from "../../store/actions/adminActions";
import { showToastify } from "../utils/reuseable";
import { ClearNotify } from "../../store/actions/notification";


const ConfirmAccount = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");
  const dispatch = useDispatch();
  const notifications = useSelector((value) => value.notification);
  const [loading, setload] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (notifications && notifications.notice) {
      if(notifications.success===false){
      
        showToastify("ERROR", notifications.notice.msg)
        dispatch(ClearNotify());
        setload(false); 
        console.log(loading)
      
      }
     
      if (notifications.success) {
        showToastify("SUCCESS", notifications.notice.msg)
        dispatch(ClearNotify());
       navigate("/");
      }
    }
  },[notifications,dispatch,navigate]);
  const Comfirmme = () => {
    setload(true);
  
    dispatch(ComfirmUserS({ t: token }));
  };

  return (
    <div
      className="mainLayout"
      style={{ minHeight: `${window.innerHeight}px` }}
    >


      <p className="verifypage" style={{fontFamily:"Roboto condensed", fontSize:"20px",fontWeight:"bold",color:"darkblue"}}>
        Please click on{" "}
        <span style={{ fontFamily: "Roboto condensed", color: "blue",fontSize:"14px" }}>Verify me</span>{" "}
        to complete process
      </p>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          
        }}
      >
        {loading ? (
          <CircleSpinner color="blue" />
        ) : (

          <span
            onClick={() => {
              Comfirmme();
            }}
            className="verifyme"
          >
            <CheckCircle /> Verify me
          </span>
        )}
      </div>
      <div className="footer">
       
          <p>
            Handcrafted By Evelyn Ashiakey and Majorie Tabitah
<span style={{ color: "green" }}> @ </span>{" "}
            2023
          </p>
       
      </div>
    </div>
  );
};

export default ConfirmAccount;
