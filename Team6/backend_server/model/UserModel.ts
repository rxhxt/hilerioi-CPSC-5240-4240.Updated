import * as Mongoose from "mongoose";
import { IUserModel } from "../interfaces/IUserModel";

class UserModel {
  public schema: Mongoose.Schema;
  public model: Mongoose.Model<IUserModel>;
  public dbConnectionString: string;

  constructor(DB_CONNECTION_STRING: string) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    this.createSchema();
    this.createModel();
  }

  private createSchema(): void {
    this.schema = new Mongoose.Schema(
      {
        googleId: { type: String, unique: true, required: true },
        displayName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        photo: { type: String },
        createdAt: { type: Date, default: Date.now }
      },
      { collection: "users" }
    );
  }

  private async createModel(): Promise<void> {
    try {
      await Mongoose.connect(this.dbConnectionString);
      this.model = Mongoose.model<IUserModel>("User", this.schema);
    } catch (e) {
      console.error("Error creating User model:", e);
    }
  }

  public async findOrCreateUser(profile: any): Promise<IUserModel> {
    try {
      const existingUser = await this.model.findOne({ googleId: profile.id });
      if (existingUser) {
        console.log("User already exists:", existingUser);
        return existingUser;
      }

      const newUser = new this.model({
        googleId: profile.id,
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