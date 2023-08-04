const { model, set } = require("mongoose");
const {
  DayModel,SheduleModel,timeNModel,IDayModel,ISheduleModel,InstituteModel,OneTimeS,Message,HolidaysModel
} = require("./../models/Database");

const express = require("express");
const { User } = require("../models/users");
const routes = express.Router();
/** creation */

routes.route("/createregularshedule").post(async (req, res) => {
  try {
    const day = req.body.day;
    const data = new SheduleModel({
      ...req.body
    });
    const content = await data.save();

    await DayModel.findByIdAndUpdate(
      { _id: day },
      {
        $push: {
          shedules: content._id
        },
      },
      { new: true, useFindAndModify: true }
    );
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});


routes.route("/createinstituteshedule").post(async (req, res) => {
  try {
    const day = req.body.day;
    const data = new ISheduleModel({
      ...req.body,
    });
    const content = await data.save();

    await IDayModel.findByIdAndUpdate(
      { _id: day },
      {
        $push: {
          shedules: content._id
        },
      },
      { new: true, useFindAndModify: true }
    );
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/createtask").post(async (req, res) => {
  try {
    const user= req.body.user;

    const data = new OneTimeS({
      ...req.body,
    });
    const content = await data.save();
    await User.findByIdAndUpdate(
      { _id: user },
      {
        $push: {
          task: content._id,
        },
      },
      { new: true,useFindAndModify: true}
    );
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});


routes.route("/createholiday").post(async (req, res) => {
  try {
    

    const data = new HolidaysModel({
      ...req.body,
    });
    const content = await data.save();
    
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});



routes.route("/message").post(async (req, res) => {
  try {
    

    const data = new Message({
      ...req.body,
    });
    const content = await data.save();
    
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});




routes.route("/modifyishedule/:id").patch(async (req, res) => {
  try {
console.log(req.params.id);
    const data = await ISheduleModel.findByIdAndUpdate({_id:req.params.id},{
      $set:{
        ...req.body
      }
    },{new:true});
  
    res.status(200).json(data);
    console.log(data);
  } catch (error) {
    res.status(400).json({ msg: error });
    console.log(error)
  }
});


routes.route("/modifytask/:id").patch(async (req, res) => {
  try {

    const data = await OneTimeS.findByIdAndUpdate({_id:req.params.id},{
      $set:{
        ...req.body
      }
    },{new:true});
  
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/modifyholiday").patch(async (req, res) => {
  try {

    const data = await HolidaysModel.findByIdAndUpdate({_id:req.params.id},{
      $set:{
        ...req.body
      }
    },{new:true});
  
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/modifyshedule/:id").patch(async (req, res) => {
  try {

    const data =await SheduleModel.findByIdAndUpdate({_id:req.params.id},{
      $set:{
        ...req.body
      }
    },{new:true});
  
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/deleteiday/:id").delete(async (req, res) => {
  try {
    
const _id=req.params.id;
    const data = await IDayModel.findByIdAndDelete({_id:_id});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/deleteday/:id").delete(async (req, res) => {
  try {
    
const _id=req.params.id;
    const data = await DayModel.findByIdAndDelete({_id:_id});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/deleteishedule/:id").delete(async (req, res) => {
  try {
    
const _id=req.params.id;
    const data =await  ISheduleModel.findByIdAndDelete({_id:_id});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/deleteshedule/:id").delete(async (req, res) => {
  try {
    
const _id=req.params.id;
    const data = await SheduleModel.findByIdAndDelete({_id:_id});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/deletemessages/:id").delete(async (req, res) => {
  try {
    
const _id=req.params.id;
    const data =await Message.findByIdAndDelete({_id:_id});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/deletetask/:id").delete(async (req, res) => {
  try {
    
const _id=req.params.id;
    const data = await OneTimeS.findByIdAndDelete({_id:_id});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});



routes.route("/deleteholiday/:id").delete(async (req, res) => {
  try {
    
const _id=req.params.id;
    const data =await  HolidaysModel.findByIdAndDelete({_id:_id});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
















module.exports = routes;
