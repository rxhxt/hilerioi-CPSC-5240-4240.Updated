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
        //get the database connection string from environment variables
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
        this.userModel = new UserModel_1.UserModel();
        this.clientId = process.env.OAUTH_ID;
        this.secretId = process.env.OAUTH_SECRET;
        // Dynamic callback URL based on environment
        const getCallbackURL = () => {
            if (process.env.NODE_ENV === 'production') {
                // For Azure, use the website URL from environment or construct it
                const azureUrl = process.env.WEBSITE_HOSTNAME
                    ? `https://${process.env.WEBSITE_HOSTNAME}`
                    : process.env.AZURE_CALLBACK_BASE_URL || 'https://job-fetchr-hee6aedmcmhrgvbu.westus-01.azurewebsites.net';
                return `${azureUrl}/auth/google/callback`;
            }
            else {
                return "http://localhost:8080/auth/google/callback";
            }
        };
        passport.use(new GoogleStrategy({
            clientID: this.clientId,
            clientSecret: this.secretId,
            callbackURL: getCallbackURL()
        }, (accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
            console.log("Inside Google strategy");
            console.log("Callback URL being used:", getCallbackURL());
            try {
                const user = yield this.userModel.findOrCreateUser(profile);
                if (user) {
                    console.log("User authenticated:", user);
                    return done(null, user); // Pass the user object to Passport
                }
                else {
                    return done(new Error("Failed to create or find user"), null);
                }
            }
            catch (error) {
                console.error("Error in Google strategy:", error);
                return done(error, null);
            }
        })));
        passport.serializeUser((user, done) => {
            console.log("Serializing user:", user);
            if (user && user.ssoID) {
                done(null, user.ssoID); // Serialize the user's SSO ID
            }
            else {
                done(new Error("Failed to serialize user: Missing ssoID"), null);
            }
        });
        passport.deserializeUser((ssoID, done) => __awaiter(this, void 0, void 0, function* () {
            console.log("Deserializing user with ssoID:", ssoID);
            try {
                // Use the existing userModel instance instead of creating a new one
                const user = yield this.userModel.model.findOne({ ssoID: ssoID });
                if (user) {
                    console.log("Deserialized user:", user);
                    done(null, user); // Pass the user object to req.user
                }
                else {
                    console.log("User not found during deserialization");
                    done(null, null); // Return null if the user does not exist
                }
            }
            catch (error) {
                console.error("Error deserializing user:", error);
                done(error, null);
            }
        }));
    }
}
exports.default = GooglePassport;
//# sourceMappingURL=GooglePassport.js.map