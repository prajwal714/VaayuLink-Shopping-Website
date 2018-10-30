var mongoose=require("mongoose");

var orderSchema=new mongoose.Schema(
{
	name: String,
	contact: String,
	address: String,
	quantity: String,
	email: String,
	date: String
});

module.exports=mongoose.model("order",orderSchema);