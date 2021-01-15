$(function () {
    // 登录注册页面切换
    $('#link_reg').on('click',function () {
        $('.login_box').hide();
        $('.reg_box').show();
    })
    $("#link_login").on('click',function () {
        $(".login_box").show();
        $(".reg_box").hide();
    })

    // 登录表单验证
    // 从layui中获取form对象
    var form = layui.form;
    form.verify({
        // 自定义一个验证用户名的规则
        unm:
        [/^[\S]{2,}$/,'用户名必须由两位以上的小写字母组成'],
        // 自定义一个验证密码的规则
        pwd:
        [/^[\S]{6,12}$/,'密码必须6到12位，且不能有空格'],
        // 自定义一个再次确认密码的规则
        repwd:
        function (value) {
            // 通过形参拿到确认密码框中的内容
            // 拿到密码框中的内容
            var pwd = $(".reg_box [name=password]").val().trim();
            // 判断
            if(pwd !== value) {
                return '两次输入的密码不一致'
            }
        }
    })

    // 发起ajac请求注册用户
    var layer = layui.layer
    // 注册监听提交事件
    $("#form_reg").on("submit",function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax请求
        var data ={
            username : $(".reg_box [name=username]").val().trim(),
            password : $(".reg_box [name=password]").val().trim(),
        } 
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: data,
            success: function (res) {
                if(res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录!');
                // 清空表单的内容
                $("#form_reg")[0].reset();
                // 跳转到登录界面
                $("#link_login").click();
            }
        });
    })

    // 监听登录的ajax请求
    $("#form_login").on("submit",function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: "POST",
            url: "/api/login",
            // 快速获取表单的内容
            data: $("#form_login").serialize(),
            success: function (res) {
                if(res.status !== 0) {
                    return layer.msg('登陆失败')
                }
                layer.msg('登陆成功！')
                // 将登陆得到的token字符串保存到localstorage中
                // token相当于一个登录的身份符，有了才能登陆进入
                localStorage.setItem('token',res.token);
                // 跳转到后台页面
                location.href = '/index.html'
            }
        });
    })
})