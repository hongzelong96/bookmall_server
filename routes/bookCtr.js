var express = require('express')
var router = express.Router()
var bookApi = require('../api/book');

const multer = require("multer"); //是node的中间件, 处理表单数据 主要用于上传文件 
let fs = require('fs');//fs模块：fs模块用于对系统文件及目录进行读写操作。
let path = require('path');//用于处理文件路径的小工具

let uploadImg = multer({
	storage: multer.diskStorage({
		//设置文件存储位置
		destination: function(req, file, cb) {
			let dir = "./upload/productImg/"

			//判断目录是否存在，没有则创建
			if (!fs.existsSync(dir)) {
                console.log('dosent exist')
				fs.mkdirSync(dir, {
					recursive: true
				});
			}
			//dir就是上传文件存放的目录
			cb(null, dir);
		},
		//设置文件名称
		filename: function(req, file, cb) {
			let fileName =Date.now() + "-" + file.originalname;
			//fileName就是上传文件的文件名
			cb(null, fileName);
		}
	})
});
router.get('/getBooklistByCategory', function (req, res) {
    bookApi.getBooklistByCategory(req, res, function (result) {
        res.send(result)
    });
});
router.get('/getBooklistByCategoryTotal',function(req,res){
    bookApi.getBooklistByCategoryTotal(req,res,function(result){
        res.send(result)
    })
})
router.get('/getBooklistByPage',function(req,res){
    bookApi.getBooklistByPage(req,res,function(result){   
        res.send(result)
    });
}); 

router.get('/getBookDetail', function (req, res) {
    bookApi.getBookDetailById(req, res, function (result) {
        res.send(result)
    });
});

router.get('/getBookDetailInBM',function(req,res){
    bookApi.getBookDetailByIdInBM(req,res,function(result){
        console.log("===>",result)
        res.send(result)
    })
})
router.get('/getBooklistByPageInBM',function(req,res){
    bookApi.getBooklistByPageInBM(req,res,function(result){
        res.send(result)
    });
})

router.get('/getBooklistByName',function(req,res){
    bookApi.getbooklistByName(req,res,function(result){
        res.send(result)
    })
})
router.get('/getBooklistByAuthor',function(req,res){
    bookApi.getbooklistByAuthor(req,res,function(result){
        res.send(result)
    })
})

router.post('/uploadPic',uploadImg.array('file',9),(req,res)=>{
    bookApi.uploadPicToDB(req,res,function(result){
        res.send(result)
    })
})
//下载图片
router.get('/getPic',function(req,res){
    bookApi.getPictureById(true,req.query.BookId,function(result){
        console.log("GET PIC result",result)
        final={
            code:200,
            msg:'success',
            picArray:result
        }
        res.send(final)
    })
});

router.get('./getBookListBySth',function (req,res) {
    bookApi.getbooklistBySth(req,res,function(result){
        res.send(result)
    })    
})
router.get('/delePic',function(req,res){
    bookApi.delePic(req,res,function(result){
        res.send(result)
    })
})

router.get('/deletBook',function(req,res){
    bookApi.deletBook(req,res,function(result){
        res.send(result)
    })
})

router.post('/updateBookDetail',function(req,res){
    bookApi.updateBookDetail(req,res,function(result){
        console.log("UpdateBook detail",result)
        res.send(result)
        
    })
})

router.post('/insertBookDetail',function(req,res){
    bookApi.insertBookDetail(req,res,function(result){
        console.log("insertbook detail success",result)
        res.send(result)
    })
})

router.post('/getBooklistByCategoryInBM', function (req, res) {
    bookApi.getBooklistByCategoryInBM(req, res, function (result) {
        res.send(result)
    });
});
module.exports = router