const express = require('express')
const session = require('express-session')
const fs=require('fs');
const app = express();

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	name:""
  }))

app.set("view engin","ejs");

app.get("/",function(req,res){
	//if not login
	//call login page
	///else
	if(req.session.is_logged_in)
	{
		res.render("home.ejs",{name:req.session.name});
 	}
	 else
	{
		res.redirect("/login");
	}
});

app.get("/login",function(req,res){
	if(req.session.is_logged_in)
	{
		res.render("home.ejs",{name:req.session.name});
	}
	else
	{
	res.sendFile(__dirname+"/public/logIn/index.html");
	}
})
app.post("/login",function(req,res){
 
	fs.readFile(__dirname+"/data.txt","utf-8",function(err,data){
		
		if(data.length===0)
		{
			res.sendFile(__dirname+"/public/signIn/index.html");
		}
		else
		{
			let text=[];
			text = JSON.parse(data);
			
			let name=req.body.loginName;
			let pass=req.body.loginPassword;
			
			text.forEach(e => {
				if(e.nameValue===name&&e.passValue===pass)
				{	
					notfound=false;
					req.session.is_logged_in = true;
					req.session.name=name;
					res.render("home.ejs",{name:name});
				}
			});
			res.sendFile(__dirname+"/public/illegal/index.html")
		}
	
	});
	//if match
	//else
	//call illegal file
})
app.get("/signin",function(req,res){
	res.sendFile(__dirname+"/public/signIn/index.html")
})
app.post("/signin",function(req,res){
	//if find in data 
	//send already page exist html
	//if not find in data then 

	fs.readFile(__dirname+"/data.txt","utf-8",function(err,data){
		
		let name=req.body.signinName;
		let pass=req.body.signPassword;

		let tobeenter=false
		if(data.length===0)
		tobeenter=true;
		let text=[];
		if(data.length>0)
		{
			text = JSON.parse(data);
			let no=0;
			text.forEach(e => {
			if(e.nameValue===name&&e.passValue===pass)
			{ 
				no++;
				res.sendFile(__dirname+"/public/alredyExist/index.html");
			}});
			if(no===data.length)
			tobeenter=true;
		}
     if(tobeenter)
	 {
		text.push({nameValue:name,passValue:pass});
		
	   fs.writeFile(__dirname+"/data.txt", JSON.stringify(text) ,function(err)
		{
			res.sendFile(__dirname+"/public/logIn/index.html");
			
		});
	 }	
	});
	

	})

app.post("/myaccount",function(req,res){
	if(req.session.is_logged_in)
		res.redirect("/logind");
	else
	 res.redirect("/logIn");
})

app.get("/logout", function(req, res)
{
	req.session.destroy();

	res.redirect("/")
})

app.listen(3000,function(){
    console.log("working on port 3000")
})
