import * as passport from 'passport';
import * as dotenv from 'dotenv';
import { UserModel } from './model/UserModel';
let GoogleStrategy = require('passport-google-oauth20-with-people-api').Strategy;

// Creates a Passport configuration for Google
class GooglePassport {
    clientId: string;
    secretId: string;
    userModel: UserModel;

    constructor() {
        // Get the database connection string from environment variables
        const dbProtocol = process.env.DB_PROTOCAL || 'mongodb://';
        const dbUser = process.env.DB_USER || '';
        const dbPassword = process.env.DB_PASSWORD || '';
        const dbInfo = process.env.DB_INFO || '';
        let dbConnectionString = '';
        if (dbUser && dbPassword) {
            dbConnectionString = `${dbProtocol}${dbUser}:${dbPassword}${dbInfo}`;
        } else {
            dbConnectionString = `${dbProtocol}${dbInfo}`;
        }

        // Initialize UserModel
        this.userModel = new UserModel(dbConnectionString);
        this.clientId = process.env.OAUTH_ID;
        this.secretId = process.env.OAUTH_SECRET;

        // Configure Google Strategy
        passport.use(new GoogleStrategy({
                clientID: this.clientId,
                clientSecret: this.secretId,
                callbackURL: process.env.NODE_ENV === 'production'
                    ? "https://your-production-domain.com/auth/google/callback"
                    : "http://localhost:8080/auth/google/callback"
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log("Inside Google strategy");
                try {
                    // Find or create the user in the database
                    const user = await this.userModel.findOrCreateUser(profile);
                    return done(null, user);
                } catch (error) {
                    console.error("Error in Google strategy:", error);
                    return done(error, null);
                }
            }
        ));

        // Serialize user into the session
        passport.serializeUser((user: any, done) => {
            done(null, user.googleId);
        });

        // Deserialize user from the session
        passport.deserializeUser(async (googleId: string, done) => {
            try {
                const user = await this.userModel.model.findOne({ googleId });
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        });
    }
}

export default GooglePassport;