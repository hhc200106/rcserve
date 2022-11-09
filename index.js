const express = require('express')
const cors = require('cors')
const port = 3000 // 服务端口
const app = express()

app.use(cors({
    origin: '*'
}))

app.use(express.urlencoded({
    extended: true
}))

app.use(require('./router/MovieActor'))
// 配置跨域

// 解析post请求参数
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('serve staring')
})
