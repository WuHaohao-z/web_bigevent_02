// 不需要入口函数
var baseURL = 'http://api-breakingnews-web.itheima.net';
// 每次调用$.get $.post $.ajax时先调用，可以拿到ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，同意拼接请求的根路径
    options.url = baseURL + options.url;
})