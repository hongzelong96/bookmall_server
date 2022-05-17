var Sql = require('../modules/sqlCommand');
var db = require('../modules/basicConnection');

function getPromotionList(req,res,next){
    db.query(Sql.promotion_sql.selectAllpromotion,function(err,row){
        let result = {}
        if(!err){
            console.log(row)
            result = {
                code:200,
                PromotionList:row
            }
        }
        else result={
            code:201,
            err:"err:"+err
        }
        next(result)
    })
}


module.exports = {
    getPromotionList
}