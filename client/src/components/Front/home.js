import React, { useEffect, useState } from "react";

const Home = () => {
  return (
    <div className="homepage" style={{minHeight:`${window.innerHeight}px`, backgroundImage: `url("https://cdn.pixabay.com/photo/2017/06/19/07/37/agenda-2418401_1280.jpg")`,  }}>
      <div
    
      >
     <p className="sitename"> <img src="https://cdn-icons-png.flaticon.com/512/5181/5181252.png"  style={{width:"50px",height:"50px"}}></img>
      <span>TimeNudge</span></p>
          <div className="layout">
         
            <p>
              Welcome to TimeNudge, the ultimate mobile app designed to
              revolutionize the way you manage your time. Whether you're a
              student striving for academic excellence or a busy professional
              juggling multiple responsibilities, Time Nudge is here to empower
              you with a personalized and efficient scheduling experience.
              Available on all platforms, Time Nudge brings together the best
              features and functionalities to streamline your daily routine.
              With its intuitive interface and powerful capabilities, this app
              becomes your trusted companion, ensuring you stay organized,
              focused, and in control of your precious time. Imagine having the
              ability to effortlessly add your institution or company schedules,
              seamlessly integrate your everyday custom routines, and adapt on
              the fly with emergency schedule updates. Time Nudge lets you do
              just that and more
            </p>

            <img src="https://www.freepnglogos.com/uploads/google-play-png-logo/get-it-on-google-play-google-play-badge-png-logos-23.png" />
          
        </div>
      </div>
      <div className="footer">
        <div>
          <p>
          Handcrafted By Evelyn Ashiakey and Majorie Tabitah
            <span style={{ color: "green" }}> @ </span> 2023
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
