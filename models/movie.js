/**
 * Created by Administrator on 2016/10/11 0011.
 */
var mongoose = require("mongoose");
var MovieSchema = require("../schemas/movie")
var movie = mongoose.model("Movie",MovieSchema)

module.exports = movie;
