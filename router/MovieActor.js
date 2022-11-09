/**
 * 定义电影演员相关的接口
 */

// 引入joi校验对象
const Joi = require('joi')
const express = require('express')
const router = express.Router()
const Response = require('../utils/Response')
// 引入数据库连接池
const pool = require('../utils/db')
/**
 * 删除演员接口
 * @param:
 * id: 演员id
 * @return:
 * {code:200,msg:'ok'}
 **/
router.post('/movie-actor/del', (req, resp) => {
    let {id} = req.body
    let schema = Joi.object({
        id: Joi.string().required(),
    })
    let {error, value} = schema.validate(req.body)
    if (error) {
        resp.send(Response.error(400, error))
        return;
    }
    let sql = "delete from movie_actor where id = ?;ALTER TABLE `movie_actor` DROP `id`;ALTER TABLE `movie_actor` ADD `id` int NOT NULL FIRST;ALTER TABLE `movie_actor` MODIFY COLUMN `id` int NOT NULL AUTO_INCREMENT,ADD PRIMARY KEY(id);"
    pool.query(sql, [id], (error, result) => {
        if (error) {
            resp.send(Response.error(500, error))
            throw error
        }
        resp.send(Response.ok())
    })
})
/**
 * 添加演员接口
 * @param:
 * actorName: 演员名字
 * actorAvatar: 演员头像路径
 * @return:
 * {code:200,msg:'ok'}
 **/
router.post('/movie-actor/add', (req, resp) => {
    let {actorName, actorAvatar} = req.body
    let schema = Joi.object({
        actorName: Joi.string().required(),
        actorAvatar: Joi.string().required()
    })
    let {error, value} = schema.validate(req.body)
    if (error) {
        resp.send(Response.error(400, error))
        throw error
    }
    let sql = 'insert into movie_actor (actor_name, actor_avatar) value (?,?)'
    pool.query(sql, [actorName, actorAvatar], (error, result) => {
        if (error) {
            resp.send(Response.error(500, error))
            throw error
        }
        resp.send(Response.ok())
    })
})

/**
 * 查询所有演员接口
 * @param:
 * page:1 当前页码
 * pageSize:10 每页条目数
 * @return:
 * {code:200,msg:'ok', data:[演员obj],[演员obj]}
 **/
router.get('/movie-actors', (req, resp) => {
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
    let sql = "select * from movie_actor limit ?,?"
    pool.query(sql, [startIndex, size], (err, result) => {
        if (err) {
            resp.send(Response.error(400, error))
            throw error
        }
        resp.send(Response.ok(result))
    })
})

/**
 * 模糊查询符合演员名称要求的接口
 * @param:
 * name: 姓名   演员姓名
 * @return:
 * {code:200,msg:'ok'}
 **/

router.post('/movie-actors/name', (req, resp) => {
    let {name} = req.body
    let schema = Joi.object({
        name: Joi.string().required(),
    })
    let {error, value} = schema.validate(req.body)
    if (error) {
        resp.send(Response.error(400, error))
        return;
    }
    let sql = "select * from movie_actor where actor_name like ?"
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