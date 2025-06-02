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
const passport = require("passport");
const UserModel_1 = require("./model/UserModel");
let GoogleStrategy = require('passport-google-oauth20-with-people-api').Strategy;
// Creates a Passport configuration for Google
class GooglePassport {
    constructor() {
        // Get the database connection string from environment variables
        const dbProtocol = process.env.DB_PROTOCAL || 'mongodb://';
        const dbUser = process.env.DB_USER || '';
        const dbPassword = process.env.DB_PASSWORD || '';
        const dbInfo = process.env.DB_INFO || '';
        let dbConnectionString = '';
        if (dbUser && dbPassword) {
            dbConnectionString = `${dbProtocol}${dbUser}:${dbPassword}${dbInfo}`;
        }
        else {
            dbConnectionString = `${dbProtocol}${dbInfo}`;
        }
        // Initialize UserModel
        this.userModel = new UserModel_1.UserModel(dbConnectionString);
        this.clientId = process.env.OAUTH_ID;
        this.secretId = process.env.OAUTH_SECRET;
        // Configure Google Strategy
        passport.use(new GoogleStrategy({
            clientID: this.clientId,
            clientSecret: this.secretId,
            callbackURL: process.env.NODE_ENV === 'production'
                ? "https://your-production-domain.com/auth/google/callback"
                : "http://localhost:8080/auth/google/callback"
        }, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
            console.log("Inside Google strategy");
            try {
                // Find or create the user in the database
                const user = yield this.userModel.findOrCreateUser(profile);
                return done(null, user);
            }
            catch (error) {
                console.error("Error in Google strategy:", error);
                return done(error, null);
            }
        })));
        // Serialize user into the session
        passport.serializeUser((user, done) => {
            done(null, user.googleId);
        });
        // Deserialize user from the session
        passport.deserializeUser((googleId, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userModel.model.findOne({ googleId });
                done(null, user);
            }
            catch (error) {
                done(error, null);
            }
        }));
    }
}
exports.default = GooglePassport;
//# sourceMappingURL=GooglePassport.js.map