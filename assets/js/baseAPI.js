// 不需要入口函数
var baseURL = 'http://api-breakingnews-web.itheima.net';
// 每次调用$.get $.post $.ajax时先调用，可以拿到ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，同意拼接请求的根路径
    options.url = baseURL + options.url;
    
    // 统一为有权限的接口，设置headers请求头
    // 判断url 里面是否携带 /my/
    if (options.url.indexOf("/my/") !== -1) {
        // 如果携带，那么我们就设置 options.headers
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
        // 控制用户的访问权限
        // 不论成功还是失败，最终都会调用complete回调函数
        options.complete = function (res) {
            // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
                // 1.强制清空token
                localStorage.removeItem('token')
                // 2.强制跳转到登录页面
                location.href = "/login.html"
            }
        }
    }
})