var buyer_sql={
    selectSome:'select * from buyers limit 0,10',
    selectSomeByPage:'select * from buyers limit ?,?',
    selectOne:'select * from buyers where id = ?',
    insertOne:'insert into buyers (name,adress,phone,commit,statu) values (?,?,?,?,?)',
    deleteOne:'delete from buyers where id = ?',
    updateOne:'update buyers set name = ?,adress = ?,phone = ?,commit = ?,statu = ?,ordertime = ? where id = ?', 
    selectAll:'select * from buyers',
}
var user_sql={
    insertOne:'insert into user (name,admin) values (?,?)',
    deleteOne:'delete from user where id = ?',
    updateOne:'update user set name = ?,admin = ? where id = ?',
    selectOne:'select * from user where name = ?',
    selectOneByToken:'select * from user where token = ?',
    selectOneByUP:'select token from user where name = ? and password = ?',
    selectAll:'select * from user',
}
var book_sql={
    insertOne:'insert into books (name,description,storage,author,price,categoryId) values (?,?,?,?,?,?)',
    deleteOne:'delete from books where book_id = ?',
    updateOne:'update books set name = ?,description = ?,storage = ?,author = ?,price = ?,categoryId = ? where id = ?',
    selectOne:'select * from books where id = ?',
    selectAll:'select * from books',
    selectNew:'select id from books order by id DESC limit 1',
    updatePicId:'update books set pictureId = ? where id = ?'
}
var category_sql={
    selectAllcategory:'select * from category where parentId = 0',
    selectAllpromotion:'select * from promotion',
    selectAllcategoryAndChild:'select * from category'
}

var picture_sql={
    insertOne:'insert into picture(book_id,url) values(?,?)'
}
var promotion_sql={
    selectAllpromotion:'select * from promotion'
}
module.exports = {
    buyer_sql,
    user_sql,
    book_sql,
    category_sql,
    picture_sql,
    promotion_sql
}