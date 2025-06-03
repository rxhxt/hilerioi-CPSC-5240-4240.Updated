"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const Mongoose = require("mongoose");
class UserModel {
    constructor() {
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        this.schema = new Mongoose.Schema({
            ssoID: { type: String, unique: true, required: true },
            displayName: { type: String, required: true },
            email: { type: String, unique: true, required: true },
            photo: { type: String },
            createdAt: { type: Date, default: Date.now }
        }, { collection: "users" });
    }
    createModel() {
        this.model = Mongoose.model("User", this.schema);
    }
    findOrCreateUser(profile) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if a user with the same SSO ID already exists
                let existingUser = yield this.model.findOne({ ssoID: profile.id });
                if (existingUser) {
                    console.log("User already exists with ssoID:", existingUser);
                    return existingUser;
                }
                // Check if a user with the same email already exists
                existingUser = yield this.model.findOne({ email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value });
                if (existingUser) {
                    console.log("User already exists with email:", existingUser);
                    // Update the SSO ID if it is missing or outdated
                    if (!existingUser.ssoID) {
                        existingUser.ssoID = profile.id;
                        yield existingUser.save();
                    }
                    return existingUser;
                }
                // Create a new user if no existing user is found
                const newUser = new this.model({
                    ssoID: profile.id,
                    displayName: profile.displayName,
                    email: (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                    photo: (_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value
                });
                const savedUser = yield newUser.save();
                console.log("New user created:", savedUser);
                return savedUser;
            }
            catch (e) {
                console.error("Error finding or creating user:", e);
                throw e;
            }
        });
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map