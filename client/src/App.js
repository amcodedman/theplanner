
import React from "react";


import {BrowserRouter,Routes,Route} from "react-router-dom"
import {ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Home from './components/Front/home';

import  "./components/style/custome.css"


import Resetpasspage from "./components/Front/resetpassword";
import ConfirmAccount from "./components/Front/confirmAccount";


function App() {

  return (
   <BrowserRouter>
<Routes>
<Route path='/' 
element={<Home/>}/> 


<Route path="/account/verification" element={<ConfirmAccount/>}/>
<Route path="/account/passwordreset" element={<Resetpasspage/>}/>

</Routes>
<ToastContainer/>
   </BrowserRouter>
  );
}

export default App;
