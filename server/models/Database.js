const bcryt = require("bcrypt");

const mongoose = require("mongoose");

const personalregularSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

    name: {
      type: String,
      default: "My timeline",
    },

    days: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "days",
      },
    ],
  },
  { timestamps: true }
);

const daySchema = mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
    },

    shedules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shedules",
      },
    ],
  },
  { timestamps: true }
);

const holidaySchema = mongoose.Schema({
  title: {
    type: String,
  },
  month: {
    type: String,
  },
  day: {
    type: String,
    required: true,
  },
});

const shedule_schema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    count: {
      type: Number,
      default: 0,
    },
    complete: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const oneTimeshedule_schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    count: {
      type: Number,
      default: 0,
    },
    group: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

const instituteSchema = mongoose.Schema(
  {
    description: {
      type: String,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    days: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "institutedays",
      },
    ],
  },
  { timestamps: true }
);

const IdaySchema = mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
    },

    shedules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "institute_shedules",
      },
    ],
  },
  { timestamps: true }
);

const Ishedule_schema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    count: {
      type: Number,
      default: 0,
    },
    complete: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const messageSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    text: {
      type: String,
    },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const InviteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    to: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    confirm: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const DayModel = mongoose.model("days", daySchema);
const SheduleModel = mongoose.model("shedules", shedule_schema);
const timeNModel = mongoose.model("regulartable", personalregularSchema);
const IDayModel = mongoose.model("institutedays", IdaySchema);
const ISheduleModel = mongoose.model("institute_shedules", Ishedule_schema);
const InstituteModel = mongoose.model("institutetable", instituteSchema);
const InviteModel = mongoose.model("invites", InviteSchema);

const HolidaysModel = mongoose.model("holidays", holidaySchema);
const Message = mongoose.model("messages", messageSchema);
const OneTimeS = mongoose.model("onetimeshedule", oneTimeshedule_schema);

module.exports = {
  DayModel,
  SheduleModel,
  timeNModel,
  IDayModel,
  ISheduleModel,
  InstituteModel,
  OneTimeS,
  Message,
  HolidaysModel,
  InviteModel,
};
