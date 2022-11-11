/**
 * 定义电影电影相关的接口
 */

// 引入joi校验对象
const Joi = require('joi')
const express = require('express')
const router = express.Router()
const Response = require('../utils/Response')
// 引入数据库连接池
const pool = require('../utils/db')

/**
 * 添加电影接口
 * @param:
 * actorName: 电影名字
 * actorAvatar: 电影头像路径
 * @return:
 * {code:200,msg:'ok'}
 **/
router.post('/movie-info/add', (req, resp) => {
    let {categoryId, cover, title, type, starActor, showingon, score, description, duration} = req.body
    let schema = Joi.object({
        categoryId: Joi.number().required(),
        cover: Joi.string().required(),
        type: Joi.string().required(),
        title: Joi.string().required(),
        type: Joi.string().required(),
        starActor: Joi.string().required(),
        showingon: Joi.string().required(),
        score: Joi.string().required(),
        description: Joi.string().required(),
        duration: Joi.string().required()
    })
    let {error, value} = schema.validate(req.body)
    if (error) {
        resp.send(Response.error(400, error))
        throw error
    }
    let sql = `insert into movie_info (category_id,cover, title, type, star_actor, showingon, score, description, duration) value (?,?,?,?,?,?,?,?,?)`
    pool.query(sql, [categoryId, cover, title, type, starActor, showingon, score, description, duration], (error, result) => {
        if (error) {
            resp.send(Response.error(500, error))
            throw error
        }
        resp.send(Response.ok())
    })
})

/**
 * 查询所有电影接口
 * @param:
 * page:1 当前页码
 * pageSize:10 每页条目数
 * @return:
 * {code:200,msg:'ok', data:[]}
 **/
router.get('/movie-types', (req, resp) => {
    let sql = "select * from movie_type"
    pool.query(sql, (error, result) => {
        if (error) {
            resp.send(Response.error(500, error))
            throw error
        }
        resp.send(Response.ok(result))
    })
})

/**
 * 模糊查询符合电影名称要求的接口
 * @param:
 * name: 姓名   电影姓名
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