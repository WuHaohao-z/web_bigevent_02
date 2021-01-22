$(function () {

    // 补零函数
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }

    // 定义时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        var dt = new Date(data);

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 1.定义提交参数
    var q = {
        pagenum: 1,//页码值
        pagesize: 2,//每页显示多少条数据
        cate_id: "",//文章分类的 Id
        state: "",//文章的状态，可选值有：已发布、草稿
    }

    // 2.获取文章列表的方法
    var layer = layui.layer
    initTable()
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染
                var str = template("tpl-table", res);
                $("tbody").html(str)
                // 调用分页
                renderPage(res.total)
            }
        });
    }


    // 3.获取所有分类
    var form = layui.form;
    initCate()
    // 封装函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template("tpl-cate", res);
                $("[name=cate_id]").html(str)
                // 单选，多选，在赋值之后要重获取
                form.render()
            }
        });
    }


    // 4.筛选功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        // 获取
        var state = $("[name=state]").val()
        var cate_id = $("[name=cate_id]").val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })

    // 5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // console.log(total);
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            // 每页显示几条数据
            limit:q.pagesize,
            // 一共多少条数据
            curr:q.pagenum,
            // 分页模块设置，显示了那些子模块
            layout:['count','limit','prev','page','next','skip'],
            // 每页显示多少条数据
            limits:[2,3,5,10],
            // 回调函数
            jump: function(obj, first){
                //obj包含了当前分页的所有参数
                //console.log(obj.curr); 得到当前页，以便向服务端请求对应页的数据。
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                if(!first){
                    initTable()
                }
              }
        });
    }


    // 6.删除
    $("tbody").on("click",".btn-delete",function () {
        // 获取当前id
        var id = $(this).attr("data-id")
        console.log(id);
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if(res.status !== 0 ){
                        return layer.msg(res.message)
                    }
                    layer.msg("删除成功！！！")
                    // 当前页 -1 满足两个条件：页面中只有一个元素且当前页页码大于1 
                    if($(".btn-delete").length === 1 && q.pagenum >= 2) q.pagenum--;
                    // 如果我们更新成功了，就要重新渲染页面中的数据
                    initTable()
                }
            });
            layer.close(index);
          });
    })
    

})