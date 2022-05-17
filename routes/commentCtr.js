var express = require('express')
var router = express.Router()
var commentApi = require('../api/comment');

router.get("/getcomment",function(req,res){
    commentApi.getComment(req,res,function(result){
        res.send(result)
    })
})
module.exports = router