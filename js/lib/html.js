var Html = {
    //根据传入的url获取到页面信息
    getHtml: function (url, try_times, callback, sync) {
        sync = sync == 'false' ? false : true;
        $.ajax({
            url: url,
            type: "GET",
            async: sync,
            timeout: 60000,
            data: {},
            success: function (data) {
                typeof (data) == "object" && (data = JSON.stringify(data));
                callback({html: data});
            },
            complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {
                    try_times >= 3 ? callback({html: ""}) :
                        setTimeout(function () {
                            Html.getHtml(url, (try_times + 1), callback);
                        }, 5000);
                } else if (status == 'parsererror') {
                    var data = XMLHttpRequest.responseText;
                    callback({html: data});
                } else if (status == 'error') {
                    callback({html: ""});
                }
            }
        });
    },

    getData: function (url, try_times, callback) {
        $.ajax({
            url: url,
            type: "GET",
            timeout: 60000,
            data: {},
            async: false,
            success: function (data) {
                typeof (data) == "object" && (data = JSON.stringify(data));
                callback({html: data});
            },
            complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {
                    try_times >= 3 ? callback({html: ""}) :
                        setTimeout(function () {
                            Html.getData(url, (try_times + 1), callback)
                        }, 5000);
                } else if (status == 'parsererror') {
                    var data = XMLHttpRequest.responseText;
                    callback({html: data});
                } else if (status == 'error') {
                    callback({html: ""});
                }
            }
        });
    },

    postHtml: function (url, params, try_times, callback, sync) {
        var async = sync == 'false' ? false : true;
        $.ajax({
            url: url,
            type: "POST",
            timeout: 60000,
            async: async,
            data: params,
            dataType: "json",
            success: function (data) {
                callback(data);
            }, error: function (res) {//增加访问出错信息返回
                callback({"code": 0, "msg": res.statusText});
            }
        });
    }
};