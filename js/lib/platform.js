var SmtCrawl = {

    reConfig: [
        new RegExp("descUrl=\"(.*)\";")
    ],

    getDescUrl: function (html) {
        var descUrl = "";
        for (var i in SmtCrawl.reConfig) {
            var urlArr = SmtCrawl.reConfig[i].exec(html);
            if (urlArr) {
                descUrl = urlArr[1];
                break;
            }
        }
        return Crawl.fillUrl(descUrl, true);
    },

    getNewDescUrl: function (html) {
        var descUrl = "",
            start = html.indexOf("\"descriptionUrl\":\"");
        if (start > -1) {
            html = html.substring(start + 18, html.length);
            start = html.indexOf("\",");
            if (start > -1) {
                descUrl = html.substring(0, start);
            }
        }
        return Crawl.fillUrl(descUrl, true);
    },

    crawl: function (url, callback, sync) {
        //处理速卖通新版产品链接，将新版产品链接转换成旧版
        var type = true;
        if (url.indexOf("aliexpress.com/item/") != -1 && url.indexOf(".html") != -1) {
            var itemId = url.substring(url.indexOf("aliexpress.com/item/") + 20, url.indexOf(".html"));
            if (itemId.indexOf("/") == -1) {
                type = false;
            }
        }
        Html.getHtml(url, 0, function (data) {
            data.url = url;
            data.platform = App.currentPlatform;
            if (data.html) {
                var descUrl = '';
                if (type) {
                    descUrl = SmtCrawl.getDescUrl(data.html);
                } else {
                    descUrl = SmtCrawl.getNewDescUrl(data.html);
                }

                //取描述信息
                Html.getHtml(descUrl, 0, function (desc) {
                    data.desc = desc.html;
                    callback(data);
                }, sync);
            } else {
                data.html = "";
                callback(data);
            }
        }, sync);
    }
};

var SmtCategoryCrawl = {

    crawl: function (data, callback) {
        var apiUrl = 'https://www.aliexpress.com/glosearch/api/product?';
        apiUrl = Common.deleteUrlQueryParam('page', apiUrl, data.url);
        console.info('apiUrl:', apiUrl);

        Html.getData(apiUrl + '&page=' + data.page, 1, function (res) {
            var json = JSON.parse(res.html.replace(/&quot;/g, '"'));
            // console.info(json);

            // 总页数
            var totalPage = Math.ceil(json.resultCount / json.resultSizePerPage);
            if (data.page < totalPage && data.page < 2) {
                data.next = true;
            } else {
                data.next = false;
            }
            data.page++;

            $.each(json.items, function (i, v) {
                data.list.push(Crawl.fillUrl(v.productDetailUrl, true));
            });

            callback(data);
        });
    }
};