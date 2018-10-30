var express=require("express"),
	app=express(),
	mongoose=require("mongoose"),
	pickup=require("./models/pickup"),
	order=require("./models/order"),
	bodyParser=require("body-parser");

	app.use(express.static("public"));
	app.set("view engine","ejs");
	app.use(bodyParser.urlencoded({extended:true}));

	mongoose.connect("mongodb://localhost/vayulink");

	app.get("/",function(req,res)
	{
		res.redirect("/About");
	});

	//Home page of website
	app.get("/About",function(req,res)
	{
		res.render("about.ejs");
	});

	//order form for placing an order
	app.get("/Order",function(req,res)
	{
		res.render("order");
	})

	app.post("/Order",function(req,res)
	{
		var name=req.body.name;
		var email=req.body.email;
		var contact=req.body.contact;
		var address=req.body.address;
		var quantity=req.body.quantity;

		var newOrder={
			name:name,
			email:email,
			contact:contact,
			address:address,
			quantity:quantity,
			date:new Date()
		};

		order.create(newOrder,function(err,placed)
		{
			if(err)
				{	
				console.log(err);
				res.redirect("/Order");
			}
			else
				{	res.send("Order Placed Succesfully");
				console.log("succesfully added "+newOrder+" to order database");
			}
		});

	});

	app.get("/admin",function(req,res)
	{
		
		order.find({},function(err,orders)
		{
			pickup.find({},function(err,pickups)
			{
				if(err)
				console.log(err);
				else
				res.render("admin",{orders:orders,pickup:pickups});
		});
			
		});
	});

	app.get("/stats",function(req,res)
	{
		order.find({},function(err,orders)
		{
			if(err)
				console.log(err);
			else
				res.render("stats",{orders:orders});
		});
		
	});

	app.post("/maps",function(req,res)
	{
		var name=req.body.name;
		var email=req.body.email;
		var contact=req.body.contact;
		var address=req.body.address;
		var quantity=req.body.quantity;

		var newpickup={
			name:name,
			email:email,
			contact:contact,
			address:address,
			quantity:quantity,
			date:new Date()
		};

		pickup.create(newpickup,function(err,placed)
		{
			if(err)
				{	
				console.log(err);
				res.redirect("/maps");
			}
			else
				{	res.send("We will pickup within 5 business days");
					
					
				console.log("succesfully added "+newpickup+" to pickup database");
			}
		});
	})
	app.get("/maps",function(req,res)
	{
		res.render("maps");
	})
	app.listen(3001,'127.0.0.1',function()
	{
		console.log("Server started at 3001")
	})

	