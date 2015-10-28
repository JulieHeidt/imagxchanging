var mongoose	= require( 'mongoose' ),
	photosController = require( '../controllers/photosController'),
	Schema 		= mongoose.Schema;
	

// creates an image

	PhotoSchema = new Schema({
		title: {type: String, require: true},
		caption: {type: String, require: true},
		subject: String,
		user: String,
		location: String,
		datetaken: Date,
		url: String,
		pricehistory: [],
		startingprice: {type: Number, require: true},
		currentprice: {type: Number, require: true},
		created_at: Date

	})

PhotoSchema.methods.counterStart = function() {
	var photo = this
	if (photo.currentprice > photo.startingprice){
			setInterval(function(){
				if (photo.currentprice <= photo.startingprice) {
					return true;
				} else {
				photo.currentprice = (photo.currentprice - 1) 

				console.log("set intervial working")
				console.log( photo.currentprice )

				photo.pricehistory.push(photo.currentprice)

				photo.save( function( err, photo ) {
				
				if( err ) res.send( err )			
			 		console.log("photo price saved")
				})		
				}
			},
				1000)
	};
	return true;
}

//grab the uploaded photo info and append it to the twitter api get request
PhotoSchema.pre('save', function(next ){
	var photo = this
	var options = {
		hostname: 'https://api.twitter.com/',
		path: '1.1/search/tweets.json?q=%23' + photo.title,
		headers: {
			Authorization: 'Bearer ' + env
		}
​
​
	}
​

module.exports = mongoose.model( 'Photo', PhotoSchema )
