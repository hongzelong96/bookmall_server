var Sql = require('../modules/sqlCommand');
var db = require('../modules/basicConnection');


function addUserAction(req, res, next) {
    var param = req.body;
    db.queryArgs(Sql.user_sql.insertOne, [param.name, param.admin], function (err, result) {
        console.log("getinto callback")
        if (!err) {
            result = {
                code: 200,
                msg: 'success'
            };
        } else {
            result = {
                code: 201,
                msg: 'err:' + err
            }
        }
        db.doReturn(res, result);
    });
}
function deleteUser(req, res, next) {
    var param = req.body.userid;
    db.queryArgs(Sql.user_sql.deleteOne, param, function (err, result) {
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
        db.doReturn(res, result);
    });
}

function queryAllUser(req, res, callback) {
    db.query(Sql.user_sql.selectAll, function (err, rows) {
        if (!err) {
            result = {
                code: 200,
                msg: 'success',
                userlist: rows,
            }
            callback(result)
        } else {
            result = {
                code: 201,
                msg: 'err:' + err,
            }
            callback(result)
        }
    });




}

function updateUser(req, res, callback) {
    let param = req.body;
    db.queryArgs(Sql.user_sql.selectOne, param.id, function (err, rows) {
        if (rows != null) {
            var user = {
                id: '',
                name: '',
                admin: ''
            };
            var row = rows[0];
            (param.name == '') ? user.name = row.name : user.name = param.name;
            (param.admin == '') ? user.admin = row.admin : user.admin = param.admin;
            user.id = param.id;
            db.queryArgs(Sql.user_sql.updateOne, [user.name, user.admin, user.id], function (err, rows) {
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

function login(req, res, callback) {
    let param = req.body;
    // const user = param
    // req.session.user = user
    // console.log('！！！',req.session.user)
    db.queryArgs(Sql.user_sql.selectOneByUP,[param.username, param.password],function(err, rows){
        if(!err){
            result = {
                code: 200,
                msg: 'success',
                Token: rows,
            }
            callback(result)
        }else{
            result = {
                code: 201,
                msg: 'err:' + err,
            }
            callback(result)
        }
    })
}

function getUserInfoByToken(req, res, callback) {
    let param = req.body.token;
    db.queryArgs(Sql.user_sql.selectOneByToken,[param],function(err, rows){
        if(!err){
            result = {
                code: 200,
                msg: 'success',
                userlist: rows,
            }
            callback(result)
        }else{
            result = {
                code: 201,
                msg: 'err:' + err,
            }
            callback(result)
        }
    })
}
//随机生成token

module.exports = {
    addUserAction: addUserAction,
    deleteUser: deleteUser,
    queryAllUser: queryAllUser,
    updateUser: updateUser,
    login:login,
    getUserInfoByToken:getUserInfoByToken
}