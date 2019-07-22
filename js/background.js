chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'createMenu') {
        backEvent.createMenu(request.data.type, sendResponse);
    } else if (request.action === 'removeMenu') {
        backEvent.removeMenu(sendResponse);
    } else if (request.action === 'getHtml') {
        backEvent.getHtml(request.data, sendResponse);
    } else if (request.action === 'postHtml') {
        backEvent.postHtml(request.data, sendResponse);
    } else if (request.action === 'getData') {
        backEvent.getData(request.data, sendResponse);
    }
    return true;
});

var backEvent = {
    //创建菜单
    createMenu: function (type, sendResponse) {
        switch (type) {
            case 'single':
                chrome.contextMenus.create({
                    id: 'singleCrawl',
                    type: 'normal', // 类型，可选：["normal", "checkbox", "radio", "separator"]，默认 normal
                    title: '采集此产品', // 显示的文字，除非为“separator”类型否则此参数必需，如果类型为“selection”，可以使用%s显示选定的文本
                    contexts: ['all'], // 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
                    onclick: singleCrawl // 单击时触发的方法
                });
                sendResponse(type + '-ok');
                break;
            case '':
                break;
        }
    },

    removeMenu: function (sendResponse) {
        chrome.contextMenus.removeAll();
        sendResponse('ok');
    },

    //获取采集页面
    getHtml: function (data, call) {
        console.info(data);
        var url = data.url,
            try_times = data.try_times,
            callback = data.callback,
            sync = data.sync == 'false' ? false : true;

        $.ajax({
            url: url,
            type: "GET",
            async: sync,
            timeout: 60000,
            data: {},
            success: function (data) {
                typeof (data) == "object" && (data = JSON.stringify(data));
                call({html: data});
            },
            complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {
                    try_times >= 3 ? call({html: ""}) :
                        setTimeout(function () {
                            var dataNew = {
                                url: url,
                                try_times: try_times + 1,
                                callback: callback
                            };
                            backEvent.getHtml(dataNew, call);
                        }, 5000);
                } else if (status == 'parsererror') {
                    var data = XMLHttpRequest.responseText;
                    call({html: data});
                } else if (status == 'error') {
                    call({html: ""});
                }
            }
        });
    },

    //去后台采集
    postHtml: function (data, call) {
        var url = data.url,
            params = data.params,
            try_times = data.try_times,
            async = data.sync == 'false' ? false : true;

        //console.log(params);
        $.ajax({
            url: url,
            type: "POST",
            timeout: 60000,
            async: async,
            data: params,
            dataType: "json",
            success: function (data) {
                call(data);
            }, error: function () {//增加访问出错信息返回
                call({"code": 0, "msg": ""});
            }
            ,
            complete: function (XMLHttpRequest, status) {
                if (status == 'error') {
                    call({"code": -1, "msg": "请求出错"});
                } else if (status == 'parsererror') {
                    call({"code": -1, "msg": "您的EasyERP账号sk请先登录"});
                } else if (status == 'timeout') {
                    call({"code": 0, "msg": ""});
                }
            }
        });
    },

    //获取数据
    getData: function (data, call) {
        var url = data.url,
            try_times = data.try_times,
            callback = data.callback;

        $.ajax({
            url: url,
            type: "GET",
            timeout: 60000,
            data: {},
            async: false,
            success: function (data) {
                typeof (data) == "object" && (data = JSON.stringify(data));
                call({html: data});
            },
            complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {
                    try_times >= 3 ? call({html: ""}) :
                        setTimeout(function () {
                            var dataNew = {
                                url: url,
                                try_times: try_times + 1,
                                callback: callback
                            };
                            backEvent.getData(dataNew, call)
                        }, 5000);
                } else if (status == 'parsererror') {
                    var data = XMLHttpRequest.responseText;
                    call({html: data});
                } else if (status == 'error') {
                    call({html: ""});
                }
            }
        });
    }
};


/*chrome.contextMenus.create({
    id: 'searchCrawl',
    type: 'normal',
    title: '采集当前页产品',
    contexts: ['all'],
    onclick: searchCrawl
});*/

function singleCrawl(info, tab) {
    chrome.tabs.sendMessage(tab.id, {url: info.pageUrl});
}

function searchCrawl(info, tab) {
    chrome.tabs.sendMessage(tab.id, {url: info.pageUrl});
}