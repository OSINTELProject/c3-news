const functions = require( "firebase-functions" );
const express = require( "express" );
const utils = require( "./utils/main.js" );

const app = express();
// https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js
const validateFirebaseIdToken = async ( req , res , next ) => {
	functions.logger.log( 'Check if request is authorized with Firebase ID token' );
	if ( ( !req.headers.authorization || !req.headers.authorization.startsWith( 'Bearer ') ) &&
		!(req.cookies && req.cookies.__session)) {
		functions.logger.error(
		'No Firebase ID token was passed as a Bearer token in the Authorization header.',
		'Make sure you authorize your request by providing the following HTTP header:',
		'Authorization: Bearer <Firebase ID Token>',
		'or by passing a "__session" cookie.'
		);
		res.status(403).send('Unauthorized');
		return;
	}
	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		functions.logger.log('Found "Authorization" header');
		// Read the ID Token from the Authorization header.
		idToken = req.headers.authorization.split('Bearer ')[1];
	}
	else if(req.cookies) {
		functions.logger.log('Found "__session" cookie');
		// Read the ID Token from cookie.
		idToken = req.cookies.__session;
	}
	else {
		// No cookie
		res.status(403).send('Unauthorized');
		return;
	}
	try {
		const decodedIdToken = await admin.auth().verifyIdToken(idToken);
		functions.logger.log('ID Token correctly decoded', decodedIdToken);
		req.user = decodedIdToken;
		next();
		return;
	}
	catch (error) {
		functions.logger.error('Error while verifying Firebase ID token:', error);
		res.status(403).send('Unauthorized');
		return;
	}
};
// app.use( validateFirebaseIdToken );

// Build Individual Routes For Each Feed Source
const api_feed_map = require( "./api/feed/uuids.js" ).map;
const api_feed_uuids = Object.keys( api_feed_map );
for ( let i = 0; i < api_feed_uuids.length; ++i ) {
	app.get( `/feed/${ api_feed_uuids[ i ] }/db/latest` , async ( req , res ) => {
		let result = false;
		try {
			result = await require( `./api/feed/${ api_feed_uuids[ i ] }.js` ).dbGetLatest();
		}
		catch( error ) { console.log( error ); }
		res.json({
			url: req.url,
			baseUrl: req.baseUrl,
			originalUrl: req.originalUrl ,
			result: result
		});
	});
	app.get( `/feed/${ api_feed_uuids[ i ] }/update` , async ( req , res ) => {
		let result = false;
		try {
			result = await require( `./api/feed/${ api_feed_uuids[ i ] }.js` ).update();
		}
		catch( error ) { console.log( error ); }
		res.json({
			url: req.url,
			baseUrl: req.baseUrl,
			originalUrl: req.originalUrl ,
			result: result
		});
	});
}

// Global Route For Each Users 'Home' Page,
// Fetches DB stream built from each users selected sources
app.get( '/feed/all' , async ( req , res ) => {
	res.json({
		url: req.url,
		baseUrl: req.baseUrl,
		originalUrl: req.originalUrl ,
		result: "why"
	});
});

// app.get( '/test' , async ( req , res ) => {

// 	res.json({
// 		url: req.url,
// 		baseUrl: req.baseUrl,
// 		originalUrl: req.originalUrl ,
// 		redis_connected: rmu.redis.connected ,
// 		redis_ready: rmu.redis.ready ,
// 		result: result
// 	});
// });

// https://firebase.google.com/docs/functions/http-events
// https://github.com/firebase/functions-samples
const api = functions.https.onRequest( app );
module.exports = { api }


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// exports.getRSS = functions.https.onRequest( async ( req , res ) => {
//     // Grab the text parameter.
//     console.log( req );
//     // const original = req.query.text;
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     // const writeResult = await admin.firestore().collection('messages').add({original: original});
//     // // Send back a message that we've successfully written the message
//     // res.json({result: `Message with ID: ${writeResult.id} added.`});
//     res.json( { "request": req } );
//   });

