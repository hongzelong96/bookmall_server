var express = require('express')
var router = express.Router()
var buyerApi = require('../api/buyer');


router.post('/selectSome',function(req,res,next){
    buyerApi.selectSome(req,res,function(result){
        res.send(result)
    });
}); 

router.post('/GetBuyerlist',function(req,res){
    buyerApi.selectSomeByPage(req,res,function(result){
        res.send(result)
    });
});



router.post('/AddBuyerlist',function(req,res,next){
    buyerApi.Addbuyer(req,res,function(result){
        res.send(result)
    })
})

router.get('/deleteBuyerOne',function(req,res,next){
    buyerApi.DeletebuyerOne(req,res,function(res,result){
        res.send(result)
    });
});

router.get('/UpDataBuyerlist',function(req,res,next){
    buyerApi.UpdatabuyerList(req,res,function(result){
        res.send(result)
    });
});
module.exports = router