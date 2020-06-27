// 在发送真正的 ajax 请求之前，会先执行这个函数，统一拼接请求的根路径
$.ajaxPrefilter(function (options) {
    options.url = 'http://127.0.0.1:3007' + options.url
})