var express = require('express')
var router = express.Router()
var promotionApi = require('../api/promotion');

router.get('/getPromotionList',function(req,res){
    promotionApi.getPromotionList(req,res,function(result){
        res.send(result)
        console.log(result)
    })
})

module.exports = router