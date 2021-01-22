$(function () {
    // 初始化文章类别列表展示
    initArtCateList()
    // 封装函数
    function initArtCateList() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                if(res.status !== 0){
                    return console.log(res.message);
                }
                console.log(res);
                var htmlStr = template("tpl-table",res);
                $("tbody").html(htmlStr);
            }
        });
    }

    // 显示添加文章分类列表
    var layer = layui.layer
    // 弹出框创建和删除不在一个函数里，搞个全局变量
    var indexAdd = null;
    $("#btnAddCate").on("click",function () {
        // 利用框架代码，显示提示添加文章列表
        indexAdd = layer.open({
            // 干掉确定键
            type:1,
            // 修改内容的宽高
            area:["500px","250px"],
            title: '添加文章分类',
            content: $("#dialog-add").html(),
          });               
    })


    // 提交添加文章内容
    // 通过委托的方式
    $("body").on("submit","#form-add",function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                // 刷新列表
                initArtCateList()
                layer.msg("新增文章分类成功！");
                // 关闭对应的弹出层
                layer.close(indexAdd)
            }
        });
    })


    // 提交添加文章内容
    // 通过委托的方式
    var indexEdit = null
    var form = layui.form
    $("tbody").on("click",".btn-edit",function () {
        // 利用框架代码，显示提示添加文章列表
        indexEdit = layer.open({
            // 干掉确定键
            type:1,
            // 修改内容的宽高
            area:["500px","250px"],
            title: '修改文章分类列表',
            content: $("#dialog-edit").html(),
          });   
        //   获取id，发送ajax获取数据，渲染到页面
          var id = $(this).attr("data-id");
          $.ajax({
              method: "GET",
              // /:id是动态参数，/:都不可以删除
              url: "/my/article/cates/" + id,
              success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
              //   赋值
                form.val("form-edit",res.data)
                console.log(res);
                console.log(id);
              }
          });
    })

    // 修改添加文章内容
    // 通过委托的方式
    $("body").on("submit","#form-edit",function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg("修改文章分类成功！");
                // 关闭对应的弹出层
                layer.close(indexEdit)
                // 刷新列表
                initArtCateList()
            }
        });
    })


    // 通过代理的形式，未删除按钮绑定点击事件
    $("tbody").on("click",".btn-delete",function() {
        var id = $(this).attr("data-id");
        // 弹出询问框
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //发起请求
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if(res.status !== 0){
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg("删除分类成功！！")
                    layer.close(index);
                }
            });
          });
    })
})