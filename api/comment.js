var Sql = require('../modules/sqlCommand');
var db = require('../modules/basicConnection');

function getComment(req,res,callback){
    console.log(req.query)
    db.query("SELECT c_comment,cc.name,cc.avatar FROM books b INNER JOIN comments c ON  c.bookId = b.id LEFT JOIN customer cc ON c.userId = cc.id WHERE b.id = " + req.query.BookId,function(err,row){
        if(!err){
            result={
                code:200,
                res:row
            }
            callback(result)
        }
        else result={
            code:201,
            msg:'err'+err
        }
    })
}

module.exports ={
    getComment
}