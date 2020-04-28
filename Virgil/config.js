require('dotenv').config();

const requiredParams = [
    "APP_ID", // Sanctuary unique public App ID registered on Virgil account
    "APP_KEY", // Sanctuary private key: used to sign the JWTs.
    "APP_KEY_ID", // ID of user's App Key. A unique string value that identifies their account in the Virgil Cloud (for public key exchange).
].filter(name => !process.env[name]);

if (requiredParams.length > 0) {
    throw new Error(`Invalid configuration. Missing: ${requiredParams.join(', ')} in .env file`);
}

module.exports = {
    virgil: {
        //The appKey and appKeyId are updated frequently so the same keys aren't being used for long durations.
        appId: process.env.APP_ID,
        appKey: process.env.APP_KEY,
        appKeyId: process.env.APP_KEY_ID
    }
};