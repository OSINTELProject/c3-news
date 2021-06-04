// http://bostonreview.net/rss.xml
const utils = require( "../../utils/main.js" );

module.exports.dbGetLatest = function( total_items ) {
	return new Promise( async function( resolve , reject ) {
		try {
			console.log( "GET /api/feed/6a0050a6-c4ce-11eb-9851-149d997d632b/db/latest" );
			let uuid = "6a0050a6-c4ce-11eb-9851-149d997d632b";
			let url = "http://bostonreview.net/rss.xml";
			let redis = await utils.GetRedisConnection();
			let key = `C3NEWS.FEED.${uuid}.LATEST`;
			let result = await redis.keyGet( key );
			resolve( JSON.parse( result ) );
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
};

module.exports.update = function( total_items ) {
	return new Promise( async function( resolve , reject ) {
		try {
			console.log( "GET /api/feed/6a0050a6-c4ce-11eb-9851-149d997d632b/update" );
			let uuid = "6a0050a6-c4ce-11eb-9851-149d997d632b";
			let url = "http://bostonreview.net/rss.xml";
			let redis = await utils.GetRedisConnection();
			let key = `C3NEWS.FEED.${uuid}.LATEST`;
			await redis.keyDel( key );
			let result = await utils.GetXMLFeed( url );
			await redis.keySet( key , JSON.stringify( result ) );
			resolve( result );
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
};