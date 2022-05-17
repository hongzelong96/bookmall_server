module.exports = {
    db:{      //创建mysql实例
        host: 'localhost', 
        user: 'root',       
        password: '123456',
        database: 'bookshop_database',
        port: 3306,  
        connectionLimit: 30,
        multipleStatements:true
    }
}