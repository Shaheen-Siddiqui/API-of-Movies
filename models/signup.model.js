const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  updatedContect:Number,
  password: String,
  profilePictureUrl: String,
  phoneNumber: Number,
},
                                         
  {
    timestamps: true,
  }
)

const signupModel = mongoose.model('user', SignupSchema);

module.exports = { signupModel };



