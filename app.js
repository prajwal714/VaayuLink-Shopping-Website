var express=require("express"),
	app=express(),
	mongoose=require("mongoose"),
	pickup=require("./models/pickup"),
	order=require("./models/order"),
	admin=require("./models/admin"),
	bodyParser=require("body-parser");

	app.use(express.static("public"));
	app.set("view engine","ejs");
	app.use(bodyParser.urlencoded({extended:true}));

	mongoose.connect("mongodb://localhost/vayulink");

	var passport=require("passport"),
		localStrategy=require("passport-local");

		app.use(require("express-session")({
			secret:"Hello World",
			resave:false,
			saveUninitialized: false
		}));
		app.use(passport.initialize());
		app.use(passport.session());
		passport.use(new localStrategy(admin.authenticate()));
		passport.serializeUser(admin.serializeUser());
		passport.deserializeUser(admin.deserializeUser());
	app.get("/",function(req,res)
	{
		res.redirect("/home");
	});

	app.get("/home",function(req,res)
	{
		res.render("landing.ejs");
	})

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

	app.get("/admin",isAdmin,function(req,res)
	{
		var admin=req.user;
		order.find({},function(err,orders)
		{
			pickup.find({},function(err,pickups)
			{
				if(err)
				console.log(err);
				else
				res.render("admin",{orders:orders,pickup:pickups,admin:admin});
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
	});
	app.get("/maps",function(req,res)
	{
		res.render("maps");
	});
	//AUTH routes
	//signup route
	app.get("/admin/signup",isAdmin,function(req,res)
	{
		res.render("signup");
	});
	app.post("/admin/signup",isAdmin,function(req,res)
	{
		var newAdmin=new admin({username:req.body.username});
		admin.register(newAdmin,req.body.password,function(err,admin)
		{
			if(err)
			{
				console.log(err);
				return res.render("signup");
			}
			passport.authenticate("local")(req,res,function()
			{
				console.log("Succesfully signed up");
				res.redirect("/About");
			});
		})
	});
	app.get("/admin/login",function(req,res)
	{
		res.render("login");
	});
	app.post("/admin/login",passport.authenticate("local",
		{
			successRedirect: "/admin",
			failureRedirect: "/admin/login"
		}),function(req,res)
	{

	});
	//logout route
	app.get("/admin/logout",function(req,res)
	{
		req.logout();
		res.redirect("/About");
	});
	//to check whether the person is logged in or not
	function isAdmin(req,res,next)
	{
		if(req.isAuthenticated())
			return next();
		res.redirect("/admin/login");
	}
	app.listen(3001,'127.0.0.1',function()
	{
		console.log("Server started at 3001")
	});

	