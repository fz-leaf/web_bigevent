// 在发送真正的 ajax 请求之前，会先执行这个函数，统一拼接请求的根路径
$.ajaxPrefilter(function (options) {
    // 统一为所有请求 url 添加前缀
    options.url = 'http://127.0.0.1:3007' + options.url

    // 统一为有权限的接口设置请求头
    // 判断 options.url 中是否包含 /my
    if (options.url.includes('/my')) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 添加 complete
    options.complete = function (res) {
        // console.log(res);
        const {
            status,
            message
        } = res.responseJSON
        if (status !== 0 || message === '获取数据失败！') {
            // 1. 强制清空 token 
            localStorage.removeItem('token')
            // 2. 跳转到 登录界面
            location.href = './login.html'
        }
    }
})