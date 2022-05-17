var express = require('express')
var router = express.Router()
var categoryApi = require('../api/category');

router.get('/getMallList',function(req,res,next){
    categoryApi.getMallList(req,res,function(result){
        res.send(result)
    });
}); 

router.get('/getCategory',function(req,res,next){
    categoryApi.getCategory(req,res,function(result){
        res.send(result)
    });
}); 


router.get('/getCategoryPageData',function(req,res,callback){
    categoryApi.getCategoryPageData(req,res,function(result){
        res.send(result)
        console.log("=====result:",result)
    })
})


module.exports = router

