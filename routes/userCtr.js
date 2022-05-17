var express = require('express')
var router = express.Router()
var userApi = require('../api/user');


router.post('/userlogin',function(req,res,next){
    userApi.login(req,res,function(result){
        console.log("send",result)
        res.send(result)
    });
}); 
router.get('/userLogout',function(req,res,next){
    res.send({
        code:200,
        data:"成功登出"
    })
}); 
router.post('/getUserInfo',function(req,res,next){
    userApi.getUserInfoByToken(req,res,function(result){
        res.send(result);
    });
}); 

router.get('/queryUserAction',function(req,res,next){
    userApi.queryAllUser(req,res,function(result){
        res.send(result);
   });  
}); 

router.post('/deleteUserAction',function(req,res,next){
    userApi.deleteUser(req,res,next);
});

router.post('/updateUserAction',function(req,res,next){
    userApi.updateUser(req,res,function(result){
        res.json(result);
    });
});

router.post('/addUserAction',function(req,res,next){
    userApi.addUserAction(req,res,next); 
});
 

 

 



module.exports = router