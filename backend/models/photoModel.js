var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'name' : String,
	'path' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'views' : Number,
	'likes' : Number,
	'likedBy': {
		type: Schema.Types.Array,
		ref: 'user'
	},
	'comments': [{
		type: Schema.Types.ObjectId,
		ref: 'comment'
	}],
	'tags': Array,
	'reports': {
		type:Schema.Types.Number,
		default: 0
	},
	'upvotes': {
		type: Schema.Types.Number,
		default: 0
	},
	'downvotes': {
		type: Schema.Types.Number,
		default: 0
	},
	'score': {
		type: Schema.Types.Number,
		default: 0
	}
}, {timestamps:true});

module.exports = mongoose.model('photo', photoSchema);
