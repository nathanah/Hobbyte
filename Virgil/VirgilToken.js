const { JwtGenerator } = require('virgil-sdk');
const { initCrypto, VirgilCrypto, VirgilAccessTokenSigner } = require('virgil-crypto');
const config = require('./config');

async function getJwtGenerator() {
	await initCrypto();

	const virgilCrypto = new VirgilCrypto();

	return new JwtGenerator({
		appId: config.virgil.appId, //Sanctuary's public app ID
		apiKeyId: config.virgil.appKeyId, //User's App key (public key) that identifies them on Virgil CLoud for other users.
		apiKey: virgilCrypto.importPrivateKey(config.virgil.appKey), //User's unique private key
		accessTokenSigner: new VirgilAccessTokenSigner(virgilCrypto)
	});
}

const generatorPromise = getJwtGenerator();

const generateVirgilJwt = async (req, res) => {
    const generator = await generatorPromise;
  //generates JWT based on fields returned from getJwtGenerator  
  const virgilJwtToken = generator.generateToken(req.user.identity);

  res.json({ virgilToken: virgilJwtToken.toString() });
}
module.exports = { generateVirgilJwt };