var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Movie = require("./models/movie");
var _ = require("underscore");
var port = process.env.PORT || 3000; //process是一个全局变量，获取环境中的变量
var app = express(); //启动一个web服务器

mongoose.connect("mongodb://localhost/imooc")

app.set('views', './views/pages'); //设置视图的根目录
app.set('view engine', 'jade'); //设置模块的引擎

//app.use(express.bodyParser());报错！新版的将这个和express分离了
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "bower_components")))

app.listen(port);

console.log("启动服务。。。port:" + port);

// index page
app.get("/", function(req, res) {

    //
    Movie.fetch(function(err,movies){
        if (err){
            console.log(err);
        }
        res.render("index", {// 调用当前路径下的 index.jade 模板
            title: "imooc 首页",
            movies: movies
        })
    })
})

// detail page
app.get("/movie/:id", function(req, res) {
    var id = req.params.id;

    Movie.findById(id, function(err, movie){
        res.render("detail", {
            title: "imooc " + movie.title,
            movie: {
                doctor: 'xxxxx',
                country: '美国',
                title: '机械战警',
                year: 2014,
                poster: '',
                language: '',
                falsh: '',
                summary: ''
            }
        })
    })

})

// admin page
app.get("/admin/movie", function(req, res) {
    res.render("admin", {
        title: "imooc 后台录入页",
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            falsh: '',
            summary: ''
        }
    })
})

// admin update movie
app.get("/admin/update/:id", function(req, res){
    var id = req.params.id;
     if (id){
         Movie.findById(id, function(err,movie){
             res.render("admin",{
                 title: "imooc 后台更新页",
                 movie: movie
             })
         })
     }
})

// admin post movie
app.post("/admin/movie/new", function(res, req){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie

    if (id !== "undefined") {
        Movie.findById(id, function(err, movie){
            if (err){
                console.log(err);
            }

            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err){
                    console.log(err);
                }
                res.redirect("/movie/" + movie._id)
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        _movie.save(function(err, movie) {
            if (err){
                console.log(err);
            }
            res.redirect("/movie/" + movie._id)
        })
    }
})

// list page
app.get("/admin/list", function(req, res) {
    Movie.fetch(function(err,movies){
        if (err){
            console.log(err);
        }
        res.render("list", {
            title: "imooc 列表页",
            movies: movies
        })
    })

})