var Sql = require('../modules/sqlCommand');
var db = require('../modules/basicConnection');

function selectSome(req, res, next) {
    db.query(Sql.buyer_sql.selectSome, function (err, rows) {
        if (!err) {
            result = {
                code: 200,
                msg: 'success',
                buyerlist: rows
            };
        } else {
            result = {
                code: 201,
                msg: 'err:' + err
            }
        }
        next(result)
    });
}
function selectSomeByPage(req, res,next) {
    console.log("输入页面信息",req.body)
    console.log("数据库起点",(req.body.page-1)*req.body.limit,"数目",req.body.limit)
    db.query('select count(*) from buyers',function(err,rows){
        if(!err){
            res = {
                total:rows[0]["count(*)"]
            }
            db.query('select * from buyers limit '+(req.body.page-1)*req.body.limit+','+req.body.limit, function (err, rows) {
                if (!err) {
                    res.code = 200
                    res.msg = 'success'
                    res.buyerlist = rows
                } else {
                    res = {
                        code: 201,
                        msg: 'err:' + err
                    }
                }
                next(res)
            });
        }
        else{
            res.msg = 'selectSomeByPage中获得总数出错' + err
            next(res)
        }
    })
}
function UpdatabuyerList(req, res, callback) {
    let param = req.query
    db.queryArgs(Sql.buyer_sql.selectOne, param.id, function (err, rows) {
        if (rows != null) {
            var buyer = {
                name: '',
                adress: '',
                phone: '',
                commit: '',
                statu: '',
                ordertime: '',
            };
            var row = rows[0];
            (param.name == '') ? buyer.name = row.name : buyer.name = param.name;
            (param.adress == '') ? buyer.adress = row.adress : buyer.adress = param.adress;
            (param.phone == '') ? buyer.phone = row.phone : buyer.phone = param.phone;
            (param.commit == '') ? buyer.commit = row.commit : buyer.commit = param.commit;
            (param.statu == '') ? buyer.statu = row.statu : buyer.statu = param.statu;
            (param.ordertime == '') ? buyer.ordertime = row.ordertime : buyer.ordertime = param.ordertime;
            db.queryArgs(Sql.buyer_sql.updateOne, [buyer.name, buyer.adress, buyer.phone, buyer.commit, buyer.statu, buyer.ordertime, param.id], function (err, rows) {
                if (!err) {
                    result = {
                        code: 200,
                        msg: 'success',
                    }
                } else {
                    result = {
                        code: 201,
                        msg: 'err:' + err
                    }
                }
                callback(result);
            });
        } else {
            console.log('null');
        }
    });
}

function DeletebuyerOne(req,res,callback){
    db.queryArgs(Sql.buyer_sql.deleteOne,req.query.id,function(err,result){
        if (!err) {
            result = {
                code: 200,
                msg: 'success'
            }
        } else {
            result = {
                code: 201,
                msg: 'err:' + err
            }

        }
        console.log("删除成功！！！！")
        db.doReturn(res, result);
    })
}

function Addbuyer(req,res,callback){
    let param = req.body
    db.queryArgs(Sql.buyer_sql.insertOne,[param.name,param.adress,param.phone,param.commit,param.statu],function(err,result){
        if(!err){
            result = {
                code: 200,
                msg: 'success'
            }
        }else {
            result = {
                code: 201,
                msg: 'err:' + err
            }

        }
        db.doReturn(res,result);
    })
}

module.exports = {
    selectSome,
    selectSomeByPage,
    UpdatabuyerList,
    DeletebuyerOne,
    Addbuyer,
}