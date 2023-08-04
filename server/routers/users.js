const express = require("express");
const { route } = require("express/lib/application");
const { Checkuser, checkToken, GetGeo } = require("../middleware/auth");
const {} = require("../models/users");
require("dotenv").config();
const routers = express.Router();
const { User } = require("../models/users");
const { sortArticles } = require("../middleware/utils");
const { RegisterUser, sendOtp, ResetPass } = require("../config/gateway");

const jwt = require("jsonwebtoken");
const { Admin } = require("../models/users");
const bcryt = require("bcrypt");
const {
  DayModel,
  timeNModel,
  IDayModel,
  InstituteModel,
  InviteModel,
} = require("../models/Database");
/////////////////////////////////////////////// create new user

routers.route("/preregister").post(async (req, res) => {
  try {
    const { firstname, lastname, email, age, password, username, phone } =
      req.body;
    const check_user = await User.findOne({ email: email });
    const usern = await User.findOne({ username: username });

    if (check_user || usern) {
      if (check_user && usern) {
        res.status(400).json({
          msg: "email and username used already!!",
        });
      }
      if (check_user && !usern) {
        res.status(400).json({
          msg: "email used already!!",
        });
      }
      if (usern && !check_user) {
        res.status(400).json({
          msg: "user name used already!!",
        });
      }
    } else if (!check_user) {
      const signtoken = jwt.sign(
        { firstname, lastname, email, age, password, username },
        process.env.ACCOUNT_ACTIVATION,
        { expiresIn: "1d" }
      );
      await RegisterUser(firstname, email, signtoken);
      res.status(200).json({ msg: email });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
    console.log(error);
  }
});

routers.route("/authenticateme").post(async (req, res) => {
  try {
    const { firstname, lastname, email, password, username } = jwt.verify(
      req.body.t,
      process.env.ACCOUNT_ACTIVATION
    );

    const check_user = await User.findOne({ email: email });
    const check_username = await User.findOne({ username: username });

    if (check_username || check_user) {
      if (check_user) {
        res.status(400).json({
          msg: "email verified or registered already!!",
        });
      } else {
        res.status(400).json({
          msg: "username taken!!",
        });
      }
    } else if (!check_user && !check_username) {
      const user = new User({
        firstname,
        lastname,
        email,
        password,
        username,
      });

      const save_user = await user.save();
      const name = save_user.username + " Timeline";

      const data = new timeNModel({
        user: save_user._id,
        name: name,
      });
      const table = await data.save();
      await User.findByIdAndUpdate(
        { _id: save_user._id },
        {
          $push: {
            timetable: table._id,
          },
        },
        { new: true, useFindAndModify: false }
      );
      const randomNumber = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
      const supportcareid = save_user.lastname + `${randomNumber}`;
      await User.findByIdAndUpdate(
        { _id: save_user._id },
        {
          $set: {
            parentcare: supportcareid,
          },
        },
        { new: true }
      );

      const dataI = new InstituteModel({
        user: save_user._id,
      });
      const tableI = await dataI.save();
      console.log(tableI);
      await User.findByIdAndUpdate(
        { _id: save_user._id },
        {
          $push: {
            institution: tableI._id,
          },
        },
        { new: true, useFindAndModify: false }
      );

      const dayss = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      dayss.forEach(async (day) => {
        try {
          const data = new DayModel({
            day: day,
          });
          const result = await data.save();

          await timeNModel.findByIdAndUpdate(
            { _id: table._id },
            {
              $push: {
                days: result._id,
              },
            },
            { new: true, useFindAndModify: false }
          );

          const dataI = new IDayModel({
            day: day,
          });
          const resultI = await dataI.save();

          await InstituteModel.findByIdAndUpdate(
            { _id: tableI._id },
            {
              $push: {
                days: resultI._id,
              },
            },
            { new: true, useFindAndModify: false }
          );
        } catch (error) {
          console.log(error);
        }
      });

      const token = user.generate_token();

      res.cookie("x-auth", token).json(save_user);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
    console.log(error);
  }
});
//////////////////////////////////////// get users
routers.route("/alluser").post(async (req, res) => {
  try {
    const allusers = await User.find({}).sort({ createdAt: "desc" });

    if (!allusers) {
      res.status(400).json({ msg: "no user found" });
    }
    if (allusers) {
      res.status(200).json(allusers);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
////////////GET USER//////////////////paginate
routers.route("/getallusers").post(async (req, res, next) => {
  try {
    let sortArgs = sortArticles(req.body);
    const all_user = await User.find({})
      .sort([[sortArgs.sortBy, sortArgs.order]])
      .skip(sortArgs.skip)
      .limit(sortArgs.limit);

    res.status(200).json(all_user);
    next();
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

////////////////////////////////////////////// signin users
routers.route("/signin").post(async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user_ac = await User.findOne({ email: email });
    console.log(email);

    if (user_ac) {
      console.log({ jams: user_ac });
      const matchpassword = await user_ac.comparepassword(password);

      if (matchpassword == true) {
        console.log({ jamsss: user_ac });

        res.status(200).json(user_ac);
      }
      if (matchpassword == false) {
        res.status(400).json({ msg: "Wrong user credentials" });
      }
    }
    if (!user_ac) {
      res.status(400).json({ msg: "user not found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

//////////////////////////////////////////////// modify user content
routers.route("/modifyuser/:id").patch(async (req, res) => {
  try {
    const _id = req.params.id;

    const updated_user = await User.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    res.status(200).json(updated_user);
  } catch (error) {
    res.status(400).json({ msg: "error" });
    console.log(error);
  }
});

/////////////////////////////////////////////// delete user account

/////////////////////  suspend user

routers.route("/profile").get(Checkuser, async (req, res) => {
  try {
    console.log("profile");

    const user = await req.user;
    if (user !== undefined) {
      res.status(200).json(user);
    }
    if (user === undefined) {
      res.status(400).json(user);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

////////////////////////////////// delete user

routers.route("/deluser/:id").delete(async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findByIdAndDelete(_id);

    if (user) {
      await Contactmail(
        user.email,
        "sorry, you violated our terms and condition.Your account has been retracted"
      );
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routers.route("/userresetpass/:id").patch(async (req, res) => {
  try {
    const _id = req.params.id;
    console.log({ pass: req.body });
    const user_a = await User.findById({ _id });
    if (user_a) {
      console.log(user_a);
      const matchpassword = await user_a.comparepassword(req.body.oldpass);
      if (matchpassword == false) {
        res.status(400).json({ msg: " Not Permitted ,password mismatch" });
        console.log("Not Permitted");
      }
      if (matchpassword == true) {
        const salt = await bcryt.genSalt(10);
        const hash = await bcryt.hash(req.body.newpass, salt);
        const newpass = await User.findOneAndUpdate(
          { _id },
          {
            $set: {
              password: hash,
            },
          },
          { new: true }
        );

        res.status(200).json(newpass);
      }
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});


routers.route("/invitefriend").push(async (req, res) => {
  try {
    const from = req.body.from;
    const to = req.body.to;
   const data=new InviteModel({
    ...req.body
   });



const saveinvite=   await data.save();
    res.status(200).json({ msg: "success" ,data:saveinvite});
  } catch (error) {
    res.status(400).json({ msg: "error", error: error });
  }
});




routers.route("/getinvitetome/:id").get(async(req,res)=>{

  try{

    const result=await InviteModel.find({to:req.params.id})
    res.status(200).json(result)

  }

  catch(error) {
res.status(400).json({msg:error})
}})



routers.route("/getinvitee/:id").get(async(req,res)=>{

  try{

    const result=await InviteModel.find({from:req.params.id})
    res.status(200).json(result)

  }

  catch(error) {
res.status(400).json({msg:error})
}})





routers.route("/comfirminvite/:id").get(async(req,res)=>{

  try{

    const result=await InviteModel.findOneAndUpdate({
    _id: req.params.id

    },{
      $set:{
        comfirm:true
      }
    },{new:true})
    res.status(200).json(result)

  }

  catch(error) {
res.status(400).json({msg:error})
}})



























routers.route("/addfriend").patch(async (req, res) => {
  try {
    const from = req.body.from;
    const to = req.body.to;
    const userfriend = await User.findById({ _id: from });
    const userto = await User.findById({ _id: to });

    const userAdd = await User.findByIdAndUpdate(
      {
        _id: from,
      },
      {
        $push: {
          friends: userto,
        },
      },
      {
        new: true,
        useFindAndModify: true,
      }
    );


    await User.findByIdAndUpdate({_id :to},{
      $push:{
        friends:userfriend
      }
    },{new:true,useFindAndModify: true})
    res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(400).json({ msg: "error", error: error });
  }
});

routers.route("/userforgotpass").post(async (req, res) => {
  try {
    const email = req.body.email;

    const user_a = await User.findOne({ email });

    if (!user_a) {
      res.status(400).json({ msg: "account not found" });
      console.log("Account");
    }
    if (user_a) {
      const signtoken = jwt.sign({ email }, process.env.ACCOUNT_ACTIVATION, {
        expiresIn: "1d",
      });

      console.log(signtoken);
      ResetPass(email, signtoken);

      res.status(200).json(signtoken);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
    console.log(error);
  }
});
//// reset page

routers.route("/getuser/:id").get(async (req, res) => {
  try {
    const _id = req.params.id;
    const data = await User.find({ _id: _id })

      .populate({
        path: "institution",
        populate: { path: "days", populate: { path: "shedules" } },
      })
      .populate("task")
      .populate({
        path: "timetable",
        populate: { path: "days", populate: { path: "shedules" } },
      })
      .populate("messages");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: error });

    console.log(error);
  }
});
routers.route("/passwordforgotreset").patch(async (req, res) => {
  try {
    const { email } = jwt.verify(
      req.body.email,
      process.env.ACCOUNT_ACTIVATION
    );

    const user = await User.findOne({ email: email });

    if (user) {
      const salt = await bcryt.genSalt(10);
      const hash = await bcryt.hash(req.body.password, salt);

      const updated = await User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hash,
          },
        },
        { new: true }
      );
      res.status(200).json(updated);
      console.log(updated);
    }
  } catch (error) {
    res.status(400).json({ msg: "error" });
    console.log(error);
  }
});

routers.route("/sendpasswordresetlink").post(async (req, res) => {
  try {
    const { email } = req.body;
    const check_user = await User.findOne({ email: email });

    if (check_user) {
      const _id = check_user._id;

      const token = jwt.sign({ _id }, process.env.ACCOUNT_ACTIVATION, {
        expiresIn: "1d",
      });
      await ResetPass(email, token);
      res.status(200).json({ msg: "Please check your mail" });
    }
    if (!check_user) {
      res.status(403).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

module.exports = routers;
