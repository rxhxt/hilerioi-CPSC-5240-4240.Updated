import Mongoose = require("mongoose");

interface IUserModel extends Mongoose.Document {
  googleId: string; // unique id from Google OAuth
  displayName: string; // display name of the user
  email: string; // email address
  photo: string; // users profile pic
  createdAt: Date; // when the user was created
}

export { IUserModel };