const express = require('express')
const app = express()
const port = 9000
const Response = require('./utils/Response')

//处理跨域
const cors = require('cors')
app.use(cors({
    origin: '*'
}))

// 文件上传中间件
const multer = require('multer')
const uuid = require('uuid')
const url = require("url");
const uploadTools = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'static')
        }, filename: (req, file, callback) => {
            let name = file.originalname
            let ext = name.substr(name.lastIndexOf('.'))
            let newName = uuid.v4() + ext
            callback(null, newName)
        }
    })
})

// 配置静态资源托管
app.use(express.static('static'))

app.post('/upload', uploadTools.single('file'), (req, resp) => {
    let url = "http://localhost:9000/" + req.file.filename
    console.log(req.file)
    resp.send(Response.ok(url))
})

app.listen(port, () => {
    console.log('上传文件服务已启动')
})