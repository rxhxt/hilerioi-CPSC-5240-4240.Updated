import * as Mongoose from "mongoose";
import { IUserModel } from "../interfaces/IUserModel";

class UserModel {
  public schema: Mongoose.Schema;
  public model: Mongoose.Model<IUserModel>;

  constructor() {
    this.createSchema();
    this.createModel();
  }

  private createSchema(): void {
    this.schema = new Mongoose.Schema(
      {
        ssoID: { type: String, unique: true, required: true },
        displayName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        photo: { type: String },
        createdAt: { type: Date, default: Date.now }
      },
      { collection: "users" }
    );
  }

  private createModel(): void {
    this.model = Mongoose.model<IUserModel>("User", this.schema);
  }

  public async findOrCreateUser(profile: any): Promise<IUserModel> {
    try {
      // Check if a user with the same SSO ID already exists
      let existingUser = await this.model.findOne({ ssoID: profile.id });
      if (existingUser) {
        console.log("User already exists with ssoID:", existingUser);
        return existingUser;
      }

      // Check if a user with the same email already exists
      existingUser = await this.model.findOne({ email: profile.emails?.[0]?.value });
      if (existingUser) {
        console.log("User already exists with email:", existingUser);
        // Update the SSO ID if it is missing or outdated
        if (!existingUser.ssoID) {
          existingUser.ssoID = profile.id;
          await existingUser.save();
        }
        return existingUser;
      }

      // Create a new user if no existing user is found
      const newUser = new this.model({
        ssoID: profile.id, // Use profile.id as the SSO ID
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        photo: profile.photos?.[0]?.value
      });

      const savedUser = await newUser.save();
      console.log("New user created:", savedUser);
      return savedUser;
    } catch (e) {
      console.error("Error finding or creating user:", e);
      throw e;
    }
  }
}

export { UserModel };