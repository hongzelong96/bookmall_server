var Sql = require('../modules/sqlCommand');
var db = require('../modules/basicConnection');
function getMallList(req,res,next){
    db.query(Sql.category_sql.selectAllcategory, function (err, rows) {
        if (!err) {
            result = {
                code: 200,
                msg: 'success',
                categoryList: rows
            };
            db.query(Sql.category_sql.selectAllpromotion,function(err,rows){
                if(!err){
                    result.promotion = rows
                    db.query("select id,url from picture where book_id = 0",function(err,rows){
                        console.log(rows)
                        result.swiper = rows
                        next(result)
                    })
                    
                }
                else{
                    result.code = 201
                    result.msg = err
                }
            })
        } else {
            result = {
                code: 201,
                msg: 'err:' + err
            }
            next(result)
        }
    });   
}

//只获取跟分类
function getCategory(req,res,next){
    db.query(Sql.category_sql.selectAllcategory,function(err,rows){
        if(!err){
            res = {
                code:200,
                data:rows
            }
            next(res)
        }
        else{
            res={
                code:201,
                msg:'err:'+err
            }
            next(res)
        }
    })
}

//获取所有分类
function getCategoryPageData(req,res,callback)
{
    db.queryArgs(Sql.category_sql.selectAllcategoryAndChild,function(err,rows){
        if(!err){
            result = {
                code:200,
                categoryList:rows
            }
            callback(result)
        }
        else{
            result={
                code:201,
                msg:'err:'+err
            }
            callback(result)
        }
    })
}
module.exports ={
    getMallList,
    getCategory,
    getCategoryPageData
} 