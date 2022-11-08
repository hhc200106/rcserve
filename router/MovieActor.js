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
 * 添加演员*/
router.post('/movieactor/add', (req, resp) => {
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
router.get('/movie-actor', (req, resp) => {
    let {page, pagesize} = req.query
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

// 将router对象导出
module.exports = router