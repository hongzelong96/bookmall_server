var mysql = require('mysql');
var dbConfig = require('./dbConfig');

var conn = mysql.createPool(dbConfig.db);
// console.log(dbConfig,conn.config)
// json 封装
function responseDoReturn(res, ret) {
    if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {       
		res.json(ret);
    }
 
};
 
/**
 * 封装query之sql带不占位符func
 */
function query(sql, callback) {
    // conn.connect()
    conn.getConnection((err, connection)=> {
        if(err){ 
            callback(err);
        }else{
            connection.query(sql, (err, rows)=> { 
                if(!err)
                {
                    callback(err, rows); 
                } 
                else
                {
                    console.log(err)
                }
                connection.release();              //释放链接  
            });
        }      
    });
}
 
/**
 * 封装query之sql带占位符func
 */
function queryArgs(sql,args, callback) {
    conn.getConnection((err, connection)=> {
        if(err){   
            console.log(err)        
            callback(err);
        }else{
            connection.query(sql, args,(err, rows)=> {                
                callback(err, rows);
                connection.release();
                //释放链接
            });
        }
      
    });
}
 
//exports
module.exports = {
    query: query,
    queryArgs: queryArgs,
    doReturn: responseDoReturn
}