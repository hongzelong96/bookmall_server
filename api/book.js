var db = require('../modules/basicConnection');
var Sql = require('../modules/sqlCommand');

let flag = 0

//
function getBooklistByPage(req, res, callback) {
    db.query('select * from books limit ' + (req.query.pageindex) * req.query.pagesize + ',' + req.query.pagesize, function (err, rows) {
        if (!err) {
            res = {
                code: 200,
                msg: 'success',
                booklist: rows
            };
            db.query('select count(*) from books', function (err, rows) {
                if (!err) {
                    res.count = rows[0]["count(*)"]
                }
                else {
                    res.code = 201
                    res.msg = 'err:' + err
                }
                //Object.assign(result,res,result2);
                callback(res)
            })
        } else {
            res = {
                code: 201,
                msg: 'err:' + err
            }
            callback(res)
        }
    });
}
//后台方法
function getBooklistByPageInBM(req, res, callback) {
    db.query('select * from books limit ' + (req.query.pageindex) * req.query.pagesize + ',' + req.query.pagesize, function (err, rows) {
        if (!err) {
            rows.forEach((item, index) => {
                getPictureById(true, item.pictureId, function (res) {
                    //console.log('res',res)
                    item.pictureArr = res
                })
                if (index == rows.length - 1) {
                    //console.log('changeflag',index,'  ',rows.length)
                    flag = 1
                }
            })
            if (flag) {
                res = {
                    code: 200,
                    msg: 'success',
                    booklist: rows
                };
                db.query('select count(*) from books', function (err, rows) {
                    if (!err) {
                        res.count = rows[0]["count(*)"]
                    }
                    else {
                        res.code = 201
                        res.msg = 'err:' + err
                    }
                    //Object.assign(result,res,result2);
                    callback(res)
                })
            }

        } else {
            res = {
                code: 201,
                msg: 'err:' + err
            }
            callback(res)
        }
    });
}
//通过分类给与booklist
function getBooklistByCategory(req, res, callback) {
    db.query('select * from category where id =' + req.query.category, function (err, rows) {
        if (!err) {
            //如果是大分类
            //console.log("大分类")
            if (rows[0].parentId == 0) {
                getBooklistByCategoryRoot(req, function (res) {
                    callback(result)
                })
            }
            //如果是小分类
            else {
                //console.log("是小分类")
                let sql = ''
                switch (req.query.filterby){
                    case 'all':
                        sql = 'select * from books where categoryId =' + req.query.category + ' limit ' + req.query.pageindex * req.query.pagesize + ',' + req.query.pagesize
                        break;
                    case 'rating':
                        sql = 'select * from books where categoryId =' + req.query.category + ' order by rating DESC' + ' limit ' + req.query.pageindex * req.query.pagesize + ',' + req.query.pagesize 
                        break;
                    case 'hot':
                        sql = 'select * from books where categoryId =' + req.query.category + ' and hot = \'true\'' + ' limit ' + req.query.pageindex * req.query.pagesize + ',' + req.query.pagesize 
                        break;  
                }
                console.log('sql',sql);
                db.query(sql, function (err, rows) {
                    if (!err) {
                        //找到图书列表
                        result = JSON.parse(JSON.stringify(rows))
                        //去找图书下的照片列表
                        let count = 0;
                        result.forEach(value => getPictureById(false, value.pictureId, function (res) {
                            count++
                            value.url = res[0].url
                            if (count == result.length) {
                                console.log("result",result)
                                callback(result)
                            }
                        }))
                    }
                    else {
                        result = {
                            code: 201,
                            msg: 'err:' + err
                        }
                        callback(result)
                    }
                })
            }
        }
    })
}
//通过根分类目录查找书本
function getBooklistByCategoryRoot(req, callback) {
    //console.log("byroot")
    db.query('select id from category where parentId=' + req.query.category, function (err, rows) {
        if (!err) {
            results = JSON.parse(JSON.stringify(rows))
            let sql = 'select * from books where (';
            results.forEach(element => {
                sql = sql + 'categoryId = ' + element.id + ' or '
            });
            sql = sql.substring(0, sql.length - 3)
            sql = sql+')'
            switch (req.query.filterby){
                case 'all':
                    break;
                case 'rating':
                    sql = sql + " order by rating DESC"
                    break;
                case 'hot':
                    sql = sql + 'and hot = \'true\''
                    break;  
            }
            sql = sql + ' limit ' + req.query.pageindex * req.query.pagesize + ',' + req.query.pagesize
            console.log("sql",sql)
            db.query(sql, function (err, rows) {
                if (!err) {
                    //找到图书列表
                    result = JSON.parse(JSON.stringify(rows))
                    //去找图书下的照片列表
                    let count = 0;
                    result.forEach(value => getPictureById(false, value.pictureId, function (res) {
                        count++
                        value.url = res[0].url
                        if (count == result.length) {
                            callback(result)
                        }
                    }))
                }
                else {
                    result = {
                        code: 201,
                        msg: 'err:' + err
                    }
                    callback(result)
                }
            })
        }
    })
}

function getBooklistByCategoryTotal(req,res,callback) {
    db.query('select * from category where id =' + req.query.category, function (err, rows) {
        if (!err) {
            if (rows[0].parentId == 0) {
                console.log("total parent")
                db.query('select id from category where parentId=' + req.query.category, function (err, rows) {
                    results = JSON.parse(JSON.stringify(rows))
                    let sql = 'select count(*) from books where ';
                    results.forEach(element => {
                        sql = sql + 'categoryId = ' + element.id + ' or '
                    });
                    sql = sql.substring(0, sql.length - 3)
                    db.query(sql,function(err,rows){
                        console.log(rows[0]['count(*)'])
                        result = {
                            total:rows[0]['count(*)']
                        }
                        callback(result)
                    })
                })
            }else {
                db.query('select count(*) from books where categoryId =' + req.query.category,function(err,rows){
                    result={
                        total:rows[0]['count(*)']
                    }
                    console.log("====>",result)
                    callback(result)
                })
            }

        }
    })
}
//通过bookid在picture找到书的图片
function getPictureById(isALL, bookid, callback) {
    let sql
    if (isALL) {
        sql = 'select url from picture where book_id = ' + bookid
    } else {
        sql = 'select url from picture where book_id = ' + bookid + ' limit 0,1'
    }
    //console.log("sql=>", sql)
    db.query(sql, function (err, rows) {
        if (!err) {
            //console.log("===>", rows)
            results = JSON.parse(JSON.stringify(rows))
            callback(results)
        }
        else {
            //console.log('err', err)
            result = {
                code: 201,
                msg: 'err:' + err
            }
            callback(result)
        }
    })
}
//在bookmall中获取书本详情
function getBookDetailByIdInBM(req, res, callback) {
    db.query('select * from books where id =' + req.query.BookId, function (err, rows) {
        if (!err) {
            result = {
                code: 200,
                bookDetail: rows
            }
            db.query('select url from picture where book_id = ' + result.bookDetail[0].pictureId, function (err, rows) {
                if (!err) {
                    result.swiperList = rows
                    callback(result)
                    console.log("pic===>",result)
                }
                else {
                    result.code = 201
                    result.msg = 'err:' + err
                    callback(result)
                }
            })

        } else {
            result = {
                code: 201,
                msg: 'err:' + err
            }
            callback(result)
        }
    })
}
//在uniapp中获取书本详情
function getBookDetailById(req, res, callback) {
    db.query('select name,description,author,price,pictureId from books where id =' + req.query.BookId, function (err, rows) {
        if (!err) {
            result = {
                code: 200,
                bookDetail: rows
            }
            db.query('select url from picture where book_id = ' + result.bookDetail[0].pictureId, function (err, rows) {
                if (!err) {
                    result.swiperList = rows
                    callback(result)
                    console.log("pic===>",result)
                }
                else {
                    result.code = 201
                    result.msg = 'err:' + err
                    callback(result)
                }
            })

        } else {
            result = {
                code: 201,
                msg: 'err:' + err
            }
            callback(result)
        }
    })
}
//上传图片
function uploadPic(req, res, callback) {
    callback(results = { msg: 'success' })
}
//通过作者找图书
function getbooklistByAuthor(req, res, callback) {
    db.query('select * from books where author like' + '"%' + req.query.searchInfo + '%"' + ' limit ' + (req.query.pageindex) * req.query.pagesize + ',' + req.query.pagesize, function (err, rows) {
        if (!err) {
            rows.forEach((item, index) => {
                getPictureById(true, item.pictureId, function (res) {
                    //console.log('res',res)
                    item.pictureArr = res
                })
                if (index == rows.length - 1) {
                    //console.log('changeflag',index,'  ',rows.length)
                    flag = 1
                }
            })
            if (flag) {
                res = {
                    code: 200,
                    msg: 'success',
                    booklist: rows
                };
                db.query('select count(*) from books where author like' + '"%' + req.query.searchInfo + '%"', function (err, rows) {
                    if (!err) {
                        res.count = rows[0]["count(*)"]
                    }
                    else {
                        res.code = 201
                        res.msg = 'err:' + err
                    }
                    //Object.assign(result,res,result2);
                    callback(res)
                })
            }
        } else {
            res = {
                code: 201,
                msg: 'err:' + err
            }
            callback(res)
        }
    });
}
//通过书名找图书
function getbooklistByName(req, res, callback) {
    db.query('select * from books where name like' + '"%' + req.query.searchInfo + '%"' + ' limit ' + (req.query.pageindex) * req.query.pagesize + ',' + req.query.pagesize, function (err, rows) {
        if (!err) {
            rows.forEach((item, index) => {
                getPictureById(true, item.pictureId, function (res) {
                    //console.log('res',res)
                    item.pictureArr = res
                })
                if (index == rows.length - 1) {
                    //console.log('changeflag',index,'  ',rows.length)
                    flag = 1
                }
            })
            if (flag) {
                res = {
                    code: 200,
                    msg: 'success',
                    booklist: rows
                };
                db.query('select count(*) from books where name like' + '"%' + req.query.searchInfo + '%"', function (err, rows) {
                    if (!err) {
                        res.count = rows[0]["count(*)"]
                    }
                    else {
                        res.code = 201
                        res.msg = 'err:' + err
                    }
                    //Object.assign(result,res,result2);
                    callback(res)
                })
            }
        } else {
            res = {
                code: 201,
                msg: 'err:' + err
            }
            callback(res)
        }
    });
}
//随意搜索
function getBookListBySth(params) {
    db.query('select * from books like' + '"%' + req.query.searchInfo + '%"' + ' limit ' + (req.query.pageindex) * req.query.pagesize + ',' + req.query.pagesize, function (err, rows) {
        if (!err) {
            //console.log("rows!!!!!!", rows)
            rows.forEach((item, index) => {
                getPictureById(true, item.pictureId, function (res) {
                    //console.log('res',res)
                    item.pictureArr = res
                })
                if (index == rows.length - 1) {
                    //console.log('changeflag',index,'  ',rows.length)
                    flag = 1
                }
            })
            if (flag) {
                res = {
                    code: 200,
                    msg: 'success',
                    booklist: rows
                };
                db.query('select count(*) from books where name like' + '"%' + req.query.searchInfo + '%"', function (err, rows) {
                    if (!err) {
                        res.count = rows[0]["count(*)"]
                    }
                    else {
                        res.code = 201
                        res.msg = 'err:' + err
                    }
                    //Object.assign(result,res,result2);
                    callback(res)
                })
            }
        } else {
            res = {
                code: 201,
                msg: 'err:' + err
            }
            callback(res)
        }
    });
}
//删除图片
function delePic(req, res, callback) {
    let id = req.query.url;
    console.log("id===>",id)
    db.query('delete from picture where url =' + '"' + id + '"', function (err, row) {
        if (!err) {
            let result = {
                code: 200,
                msg: 'delete success'
            }
            callback(result)
        }
        else {
            let result = {
                code: 201,
                msg: 'err :' + err
            }
            callback(result)
        }
    })
}
//上传图书详情
function updateBookDetail(req, res, callback) {
    let params = req.body.data
    //console.log("params", params);
    db.queryArgs(Sql.book_sql.selectOne, params.id, function (err, rows) {
        if (rows != null) {
            var updateData = {
                name: '',
                description: '',
                storage: '',
                author: '',
                price: '',
                categoryId: '',
            }
            var row = rows[0];
            (row.name == params.name) ? updateData.name = row.name : updateData.name = params.name;
            (row.description == params.description) ? updateData.description = row.description : updateData.description = params.description;
            (row.storage == params.storage) ? updateData.storage = row.storage : updateData.storage = params.storage;
            (row.author == params.author) ? updateData.author = row.author : updateData.author = params.author;
            (row.price == params.price) ? updateData.price = row.price : updateData.price = params.price;
            Array.isArray(params.categoryId) ? updateData.categoryId = params.categoryId[1] : updateData.categoryId = row.categoryId
            //console.log('updataData', updateData);
            db.queryArgs(Sql.book_sql.updateOne, [updateData.name, updateData.description, updateData.storage, updateData.author, updateData.price, updateData.categoryId, params.id], function (err, rows) {
                if (!err) {
                    result = {
                        code: 200,
                        msg: 'success update',
                    }
                } else {
                    result = {
                        code: 201,
                        msg: 'err:' + err
                    }
                }
                callback(result);
            })
        } else {
            console.log("get update data is null")
        }
    })
}
function uploadPicToDB(req, res, callback) {
    if (req.body.__proto__ === undefined) Object.setPrototypeOf(req.body, new Object());
    let url = "http://localhost:3000/upload/productImg/" + req.files[0].filename
    console.log("url",url)
    //console.log("url====>", url)
    db.queryArgs(Sql.picture_sql.insertOne, [req.body.pictureId, url], function (err, rows) {
        if (!err) {
            result = {
                code: 200,
                msg: "upload success"
            }
            //console.log("!err")
        } else {
            result = {
                code: 201,
                'err': err,
                msg: 'upload failure'
            }
        }
        callback(result)
    })
}
function insertBookDetail(req, res, callback) {
    //console.log("req", req.body)
    param = req.body
    db.queryArgs(Sql.book_sql.insertOne, [param.name, param.description, param.storage, param.author, param.price, param.categoryId[1]], function (err, rows) {
        if (!err) {
            db.query(Sql.book_sql.selectNew, function (err, rows) {
                res = JSON.parse(JSON.stringify(rows))
                db.queryArgs("update books set pictureId = " + res[0].id + " where id = " + res[0].id, function (err, rows) {
                    if (!err) {
                        console.log("picId add SUCCESS")
                    }
                    else {
                        console.log("picid add failure：", err)
                    }
                })
                result = {
                    code: 200,
                    msg: "success",
                    id: res[0].id
                }
                callback(result)
            })
        }
        else {
            let result = {
                code: 201,
                "err": err,
                msg: "wrong"
            }
            callback(result)
        }
    })
}
function deletBook(req,res,callback){
    console.log(req.query.id)
    
    db.query('select pictureId from books where  id = ' + req.query.id,function(err,rows){
        let flag = false
        a = JSON.parse(JSON.stringify(rows))
        picId = a[0].pictureId
        db.query('delete from books where id = ' + req.query.id,function(err,rows){
            if(!err){
                console.log('success,deletbook')
                flag = true;
            }else{
                flag = false
            }
        })
        db.query('delete from picture where book_id = ' + req.query.id,function(err,rows){
            if(!err){
                console.log('success,deletpic')
                flag = true
            }else{
                flag = false
            }
        })
        result={
            code:200,
            msg:'success delete'
        }
        callback(result)
    })
}

//后台方法
function getBooklistByCategoryInBM(req, res, callback) {
    if (req.body.searchInfo < 9) {
        //console.log("parent")
        db.query('select id from category where parentId =' + req.body.searchInfo, function (err, row) {
            if (!err) {
                sql = 'select * from books where '
                data = JSON.parse(JSON.stringify(row))
                data.forEach(element => {
                    sql = sql + 'categoryId = ' + element.id + ' or '
                });
                sql = sql.substring(0, sql.length - 3)
                sql2 = sql
                sql = sql + ' limit ' + req.body.pageindex * req.body.pagesize + ',' + req.body.pagesize
                db.query(sql, function (err, row) {
                    if (!err) {
                        row.forEach((item, index) => {
                            getPictureById(true, item.pictureId, function (res) {
                                //console.log('res',res)
                                item.pictureArr = res
                            })
                            if (index == row.length - 1) {
                                //console.log('changeflag',index,'  ',rows.length)
                                flag = 1
                            }
                        })
                        let result = {
                            booklist: row,
                            code: 200,
                            msg: 'success',
                            count: 0
                        }
                        a = sql2.replace(/\*/g, "count(*)")
                        db.query(a, function (err, rows) {
                            result.count = rows[0]["count(*)"]
                            callback(result)
                        })


                    }
                    else {
                        let result = {
                            code: 201,
                            msg: 'err!!' + err
                        }
                        callback(result)
                    }
                })
            }
            else {
                let result = {
                    code: 201,
                    msg: 'err!!' + err
                }
                callback(result)
            }
        })
    }
    else {
        //console.log("children")
        db.query('select * from books where categoryId =' + req.body.searchInfo + ' limit ' + req.body.pageindex * req.body.pagesize + ',' + req.body.pagesize, function (err, row) {
            if (!err) {
                row.forEach((item, index) => {
                    getPictureById(true, item.pictureId, function (res) {
                        //console.log('res',res)
                        item.pictureArr = res
                    })
                    if (index == row.length - 1) {
                        //console.log('changeflag',index,'  ',rows.length)
                        flag = 1
                    }
                })
                let result = {
                    booklist: row,
                    msg: 'success',
                    code: 200,
                    count: 0
                }
                db.query('select count(*) from books where categoryId =' + req.body.searchInfo, function (err, row) {
                    result.count = row[0]["count(*)"]
                    callback(result)
                })

            }
            else {
                let result = {
                    msg: 'err' + err,
                    code: 201
                }
                callback(result)
            }
        })
    }
}

module.exports = {
    getBooklistByPage,
    getBooklistByCategory,
    getBooklistByCategoryTotal,
    getBookDetailById,
    getBooklistByPageInBM,
    uploadPic,
    getbooklistByAuthor,
    getbooklistByName,
    getBookListBySth,
    getPictureById,
    delePic,
    updateBookDetail,
    uploadPicToDB,
    insertBookDetail,
    getBooklistByCategoryInBM,
    getBookDetailByIdInBM,
    deletBook
}