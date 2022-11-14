// 创建数据库连接池
const mysql = require("mysql");
const pool = mysql.createPool({
    connectionLimit: 20, // 最大连接数
    host: 'localhost',   // 主机地址
    user: 'root',        // 用户名
    password: '',        // 密码
    database: 'rcstudios',// 数据库名
    multipleStatements: true
})

pool.querySync = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = pool;