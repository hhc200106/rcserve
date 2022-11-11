/**
 * 定义电影导演相关的接口
 */

// 引入joi校验对象
const Joi = require('joi')
const express = require('express')
const router = express.Router()
const Response = require('../utils/Response')
// 引入数据库连接池
const pool = require('../utils/db')
/**
 * 删除导演接口
 * @param:
 * id: 导演id
 * @return:
 * {code:200,msg:'ok'}
 **/
router.post('/movie-director/del', (req, resp) => {
    let {id} = req.body
    let schema = Joi.object({
        id: Joi.string().required(),
    })
    let {error, value} = schema.validate(req.body)
    if (error) {
        resp.send(Response.error(400, error))
        return;
    }
    let sql = "delete from movie_director where id = ?;ALTER TABLE `movie_director` DROP `id`;ALTER TABLE `movie_director` ADD `id` int NOT NULL FIRST;ALTER TABLE `movie_director` MODIFY COLUMN `id` int NOT NULL AUTO_INCREMENT,ADD PRIMARY KEY(id);"
    pool.query(sql, [id], (error, result) => {
        if (error) {
            resp.send(Response.error(500, error))
            throw error
        }
        resp.send(Response.ok())
    })
})
/**
 * 添加导演接口
 * @param:
 * directorName: 导演名字
 * directorAvatar: 导演头像路径
 * @return:
 * {code:200,msg:'ok'}
 **/
router.post('/movie-director/add', (req, resp) => {
    let {directorName, directorAvatar} = req.body
    let schema = Joi.object({
        directorName: Joi.string().required(),
        directorAvatar: Joi.string().required()
    })
    let {error, value} = schema.validate(req.body)
    if (error) {
        resp.send(Response.error(400, error))
        throw error
    }
    let sql = 'insert into movie_director (director_name, director_avatar) value (?,?)'
    pool.query(sql, [directorName, directorAvatar], (error, result) => {
        if (error) {
            resp.send(Response.error(500, error))
            throw error
        }
        resp.send(Response.ok())
    })
})

/**
 * 查询所有导演接口
 * @param:
 * page:1 当前页码
 * pageSize:10 每页条目数
 * @return:
 * {code:200,msg:'ok', data:[导演obj],[导演obj]}
 **/
router.get('/movie-directors', (req, resp) => {
    let {page, pagesize} = req.query
    console.log(page, pagesize)
    //TODO 服务端表单验证
    let schema = Joi.object({
        page: Joi.number().required(),
        pagesize: Joi.number().integer().max(100).required()
    })
    let {error, value} = schema.validate(req.query)
    if (error) {
        resp.send(Response.error(400, error))
        throw error
    }
    // 查询数据库
    let startIndex = (page - 1) * 10
    let size = parseInt(pagesize)
    let sql = "select * from movie_director limit ?,?"
    pool.query(sql, [startIndex, size], (err, result) => {
        if (err) {
            resp.send(Response.error(400, error))
            throw error
        }
        resp.send(Response.ok(result))
    })
})

/**
 * 模糊查询符合导演名称要求的接口
 * @param:
 * name: 姓名   导演姓名
 * @return:
 * {code:200,msg:'ok'}
 **/

router.post('/movie-directors/name', (req, resp) => {
    let {name} = req.body
    let schema = Joi.object({
        name: Joi.string().required(),
    })
    let {error, value} = schema.validate(req.body)
    if (error) {
        resp.send(Response.error(400, error))
        return;
    }
    let sql = "select * from movie_director where director_name like ?"
    pool.query(sql, [`%${name}%`], (err, result) => {
        console.log(err)
        if (err) {
            resp.send(Response.error(500, error))
            throw err
        }
        resp.send(Response.ok(result))
    })
})


// 将router对象导出
module.exports = router