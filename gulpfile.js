var mygulp = require("gulp");
var connect = require("gulp-connect");
var sass = require("gulp-sass");

mygulp.task("server",function(){
	connect.server({
		root:["./"],
		port:8800,
		livereload:true
	});
});
mygulp.task("copycss",function(){
	
	return mygulp.src("src/scss/index.scss").pipe(sass()).pipe(mygulp.dest("css/")).pipe(connect.reload());
});
mygulp.task("copyjs",function(){
	return mygulp.src("src/jsmove/index.js").pipe(mygulp.dest("js/")).pipe(connect.reload());
	
});
mygulp.task("copyhtml",function(){
	 return mygulp.src("index.html").pipe(connect.reload());
});
mygulp.task("watch",function(){
	mygulp.watch("index.html",["copyhtml"]);
	mygulp.watch("src/jsmove/*",["copyjs"]);
	mygulp.watch("src/scss/*",["copycss"])
});

mygulp.task("default",["server","watch"]);

