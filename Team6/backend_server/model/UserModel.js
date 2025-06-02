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
    constructor(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        this.schema = new Mongoose.Schema({
            googleId: { type: String, unique: true, required: true },
            displayName: { type: String, required: true },
            email: { type: String, unique: true, required: true },
            photo: { type: String },
            createdAt: { type: Date, default: Date.now }
        }, { collection: "users" });
    }
    createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Mongoose.connect(this.dbConnectionString);
                this.model = Mongoose.model("User", this.schema);
            }
            catch (e) {
                console.error("Error creating User model:", e);
            }
        });
    }
    findOrCreateUser(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const existingUser = yield this.model.findOne({ googleId: profile.id });
                if (existingUser) {
                    console.log("User already exists:", existingUser);
                    return existingUser;
                }
                const newUser = new this.model({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
                    photo: (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value
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