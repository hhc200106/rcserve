/** 封装响应对象 */
const {number} = require("joi");
const response = {
    /**
     * 返回一个正确的响应对象
     * @param {object} data 响应数据
     * @param {number} code 状态码
     * @param {object} errmsg 错误信息
     * */
    ok: (data) => {
        return {
            code: 200,
            msg: 'ok',
            data: data
        }
    },
    error: (code, errmsg) => {
        return {
            code: code,
            msg: errmsg
        }
    }
}

module.exports = response