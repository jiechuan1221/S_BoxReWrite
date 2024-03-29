import { httpReq } from "./httpReq";

export default class httpUtill {
    // 获取登陆状态
    static getRegisterStatus = () => httpReq('get', '/check', '')
    // 获取验证码（登陆LOG， 注册REG，找回密码FIND）
    static getServerCodeLOG = (email) => httpReq('post', `/check/getCode/${email}/LOG`, '', { "Content-Type": "application/x-www-form-urlencoded" })
    static getServerCodeREG = (email) => httpReq('post', `/check/getCode/${email}/REG`, '', { "Content-Type": "application/x-www-form-urlencoded" })
    static getServerCodeFIND = (email) => httpReq('post', `/check/getCode/${email}/FIND`, '', { "Content-Type": "application/x-www-form-urlencoded" })
    // 邮箱地址登录验证
    static passwordLog = (data) => httpReq('post', '/check/login', data, { 'Content-Type': 'application/json' })
    // 验证码登录
    static serverLog = (data) => httpReq('post', '/check/emailLogin', data, { 'Content-Type': 'application/json' })
    // 注册
    static register = (data) => httpReq('post', '/check/register', data, { 'Content-Type': 'application/json' })
    // 退出登录
    static checkLogout = () => httpReq('post', '/check/logout', '')
    // 找回密码
    static reSetPassword = (data) => httpReq('post', '/check/findPassword', data, { "Content-Type": "application/json" })

    // 计算部分
    // 上传文件获取数据
    static getFileArray = (fileData) => httpReq('post', "/data/import", fileData)
    // 计算结果，会改变计算次数
    static getCalResult = (fileArray) => httpReq('post', '/single/caculate', fileArray)
    // 获取上传过的文件列表
    static getFileList = (pageNum, pageSize) => httpReq('get', `/data/page?pageNum=${pageNum}&&pageSize=${pageSize}`)
    // 单次计算的数据返回
    static getSingleRes = (data) => httpReq('post', "/single/calculate", data, { "Content-Type": "application/json" })
    // 删除已经上传为文件数据
    static deleteSingleFileData = (id) => httpReq('delete', `/data/${id}`, '')
    // 根据id查询对应文件计算结果
    static getSingleFileRes = (id) => httpReq("get", `/data/${id}`, "", { "Content-Type": "application/x-www-form-urlencoded" })
    // 管理员查看列表
    static getCheckUser = (data) => httpReq("post", `/admin/checkUser`, { "Content-Type": "application/x-www-form-urlencoded" }) 
}