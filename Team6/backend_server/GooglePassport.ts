import * as passport from 'passport';
import * as dotenv from 'dotenv';
import { UserModel } from './model/UserModel'
let GoogleStrategy = require('passport-google-oauth20-with-people-api').Strategy;

// Creates a Passport configuration for Google
class GooglePassport {

    clientId: string;
    secretId: string;
    userModel: UserModel;

    constructor() {
        //get the database connection string from environment variables
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
        this.userModel = new UserModel();
        this.clientId = process.env.OAUTH_ID;
        this.secretId = process.env.OAUTH_SECRET;

        // Dynamic callback URL based on environment
        const getCallbackURL = () => {
            if (process.env.NODE_ENV === 'production') {
                const azureUrl = process.env.WEBSITE_HOSTNAME 
                    ? `https://${process.env.WEBSITE_HOSTNAME}`
                    : process.env.AZURE_CALLBACK_BASE_URL || 'https://job-fetchr-hee6aedmcmhrgvbu.westus-01.azurewebsites.net';
                
                const callbackUrl = `${azureUrl}/auth/google/callback`;
                console.log('Production callback URL:', callbackUrl);
                return callbackUrl;
            } else {
                console.log('Development callback URL: http://localhost:8080/auth/google/callback');
                return "http://localhost:8080/auth/google/callback";
            }
        };

        console.log('Environment:', process.env.NODE_ENV);
        console.log('OAuth Client ID:', this.clientId ? 'Set' : 'Not Set');
        console.log('OAuth Secret:', this.secretId ? 'Set' : 'Not Set');

        passport.use(new GoogleStrategy({
                clientID: this.clientId,
                clientSecret: this.secretId,
                callbackURL: getCallbackURL()
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log("Inside Google strategy");
                console.log("Profile received:", profile?.displayName);
                try {
                  const user = await this.userModel.findOrCreateUser(profile);

                  if (user) {
                    console.log("User authenticated successfully:", user.email || user.displayName);
                    return done(null, user);
                  } else {
                    console.error("Failed to create or find user");
                    return done(new Error("Failed to create or find user"), null);
                  }
                } catch (error) {
                  console.error("Error in Google strategy:", error);
                  return done(error, null);
                }
            }
        ));

        passport.serializeUser((user: any, done) => {
            console.log("Serializing user:", user);
            if (user && user.ssoID) {
                done(null, user.ssoID); // Serialize the user's SSO ID
            } else {
                done(new Error("Failed to serialize user: Missing ssoID"), null);
            }
        });

        passport.deserializeUser(async (ssoID: string, done) => {
          console.log("Deserializing user with ssoID:", ssoID);
          try {
            // Use the existing userModel instance instead of creating a new one
            const user = await this.userModel.model.findOne({ ssoID: ssoID });

            if (user) {
              console.log("Deserialized user:", user);
              done(null, user); // Pass the user object to req.user
            } else {
              console.log("User not found during deserialization");
              done(null, null); // Return null if the user does not exist
            }
          } catch (error) {
            console.error("Error deserializing user:", error);
            done(error, null);
          }
        });
    }
}
export default GooglePassport;