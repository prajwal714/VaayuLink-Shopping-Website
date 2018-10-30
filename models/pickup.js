


var mongoose=require("mongoose");

var pickupSchema=new mongoose.Schema(
{
	name: String,
	contact: String,
	address: String,
	quantity: String,
	email: String,
	date: String
});

module.exports=mongoose.model("pickup",pickupSchema);