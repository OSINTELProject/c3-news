const FeedParser = require( "feedparser" );
const request = require( "request" );
const redis_library = require( "redis" );
const RMU = require( "redis-manager-utils" );

const personal = require( "../personal.json" );

const crypto = require( "crypto" );
const sha256 = x => crypto.createHash( "sha256" ).update( x , "utf8" ).digest( "hex" );

module.exports.GetXMLFeed = function( feed_url ) {
	return new Promise( function( resolve , reject ) {
		try {
			let results = [];
			let feedparser = new FeedParser( [{ "normalize": true , "feedurl": feed_url }] );
			feedparser.on( "error" , function( error ) { resolve("null"); } );
			feedparser.on( "readable" , function () {
				var stream = this;
				var item;
				while ( item = stream.read() ) { results.push( item ); }
			});
			feedparser.on( "end" , function() {
				resolve( results );
			});
			let feed_request = request( feed_url );
			feed_request.on( "error" , function( error ) { resolve( "null" ); });
			feed_request.on( "response" , function( res ){
				let stream = this;
				if ( res.statusCode !== 200) { console.log( "bad status code" ); resolve("null"); return; }
				else { stream.pipe( feedparser ); }
			});
		}
		catch( error ) { console.log( error ); resolve("null"); }
	});
}

module.exports.GetRedisConnection = function() {
	return new Promise( async function( resolve , reject ) {
		try {
			const redis_client = redis_library.createClient({
				host: personal.redis.host ,
				port: personal.redis.port ,
				db: personal.redis.db ,
				password: personal.redis.password ,
				retry_strategy: function ( options ) {
					if ( options.error && options.error.code === "ECONNREFUSED" ) {
						return new Error( "The server refused the connection" );
					}
					if ( options.total_retry_time > 1000 * 60 * 60 ) {
						return new Error( "Retry time exhausted" );
					}
					if ( options.attempt > 20 ) {
						return undefined;
					}
					return Math.min( options.attempt * 100 , 3000 );
				}
			});
			// https://github.com/NodeRedis/node-redis
			// https://github.com/ceberous/redis-manager-utils/blob/master/BaseClass.js
			redis_client.on( "error" , function( error ) {
				console.log( error );
			});
			redis_client.on( "ready" , function( x ) {
			// redis_client.on( "connect" , function( x ) {
				let rmu = new RMU( 4 );
				rmu.redis = redis_client;
				resolve( rmu );
				return;
			});
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
};
