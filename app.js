var express = require('express');   //引入express模块
var app = express();        //创建express的实例
const path = require('path')
var userCtr = require('./routes/userCtr')
var buyerCtr = require('./routes/buyerCtr')
var bookCtr = require('./routes/bookCtr')
var categoryCtr = require('./routes/categoryCtr')
var promotionCtr = require("./routes/promotionCtr.js")
var commentCtr = require('./routes/commentCtr.js')
const cors = require('cors'); 

//使用路由
app.use(cors({
    origin: ["http://localhost:8808","http://localhost:8082","http://localhost:8080","http://localhost:8081","http://192.168.0.117","http://192.168.0.106","http://www.hongzelong.com"], //允许访问的域名
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type","Authorization"],
}))
// app.use(session({
//     secret: '0b156fab-b923-4468-beb5-001c34a827e8',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge:3600000 * 10 }
// }))
app.use('/upload/productImg',express.static(path.join(__dirname,'./upload/productImg')))
app.use('/upload/customerAvatar',express.static(path.join(__dirname,'./upload/customerAvatar')))
app.use('/upload/promotionImg',express.static(path.join(__dirname,'./upload/promotionImg')))
//app.use(express.static('./upload'))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use((req,res,next)=>{
    console.log(req.method,"req.url：",req.url,Date.now(),"req.query:",req.query,"req.body:",req.body)
    next()
})
app.use('/',userCtr);
app.use('/',buyerCtr);
app.use('/',bookCtr);
app.use('/',categoryCtr);
app.use('/',promotionCtr);
app.use('/',commentCtr);
app.use((req,res,next)=>{
    res.status(404).send('url 404 No Found!')
})
app.use((err,req,res,next)=>{
    console.log("mistake:",err)
    res.status(500).json({
        error:err.message
    })

})

app.listen(3000,function () {
    console.log('正在监听 3000 端口...');
});