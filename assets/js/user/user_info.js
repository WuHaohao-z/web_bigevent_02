// 入口函数
$(function () {
    // 1.自定义验证规则
    var form = layui.form;

    // 验证
    form.verify({
        nickname:function (value) {
            if(value.length > 6){
                return "昵称长度不能超过6位"
            }
        }
    });
    
    // 2.初始化用户的基本信息
    var layer = layui.layer;
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message);
                }
                console.log(res);
                // 获取成功后渲染页面
                form.val('formUserInfo', res.data)
            }
        });
    }

    // 3.实现表单的重置
    $("#btnReset").on("click",function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        // 重新调用 initUserInfo() 函数，重新获取用户信息
        initUserInfo() 
    })

    // 4.发起请求更新用户的信息
    $(".layui-form").on("click",function (e) {
        // 监听表单提交事件，在事件处理函数里面取消默认行为
        e.preventDefault();
        // 查阅接口文档，利用 $.ajax()发起 post 请求
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            // 利用 $(this).serialize() 获取表单数据
            data:$(this).serialize(),
            success: function (res) {
                // 如果返回的 status 不为0，说明更新失败，及逆行提示
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg("更新用户信息成功")
                // 更新成功之后，调用父页面中的方法，重新渲染用户的头像和用户信息
                window.parent.getUserInfo();
            }
        });
    })


})