/**
 * Crawl
 */
var Crawl = {
    config: {
        "singleCrawl": [
            {"aliexpress.com": SmtCrawl}
        ],
        "searchCrawl": [
            {"aliexpress.com": SmtCategoryCrawl}
        ]
    },

    getCrawlObject: function (type, url) {
        for (var j in Crawl.config[type]) {
            for (var key in Crawl.config[type][j]) {
                var chKey = key;
                if (chKey.indexOf("&-&") > -1) {
                    chKey = key.split("&-&")[0];
                }
                if (url.indexOf(chKey) > -1) {
                    return Crawl.config[type][j][key];
                }
            }
        }
        return null;
    },

    singleCrawl: function (info) {
        var crawlObj = Crawl.getCrawlObject(info.type, info.url);
        if (!crawlObj) {
            Message.warning('找不到采集对象：' + App.currentPlatform);
            return false;
        }
        Message.success('正在采集中，请稍后...');
        crawlObj.crawl(info.url, function (data) {
            if (data.html) {
                Html.postHtml(Config.url.postHtml(), data, 0, function (result) {
                    result.code === 0 ? Message.success(result.msg) : Message.error(result.msg);
                    console.info('result:', result);
                });
            } else {
                Message.warning('Oh，采集不到数据，请检查页面元素是否改变了.');
            }
        });
    },

    searchCrawl: function (info) {
        var crawlObj = Crawl.getCrawlObject(info.type, info.url);
        crawlObj && crawlObj.crawl(info.url, function (data) {  // 回调函数
            if (data.list && data.list.length > 0) {
                if (data.url.indexOf("aliexpress.com") > 0) {
                    for (var i in data.list) {
                        setTimeout(function () {
                            Crawl.singleCrawl({type: "singleCrawl", url: data.list[i]});
                        }, i * 1000);
                    }
                } else {
                    for (var i in data.list) {
                        Crawl.singleCrawl({type: "singleCrawl", url: data.list[i]});
                    }
                }
            }
            if (data.next) {
                Crawl.searchCrawl({type: "searchCrawl", url: data.next});
            }
        });
    },

    fillUrl: function (url, httpFlag) {
        if (url) {
            if (url.indexOf("http") == -1 && url.indexOf("HTTP") == -1) {
                if (httpFlag) {
                    url = "https:" + url;
                } else {
                    url = "http:" + url;
                }
            } else if (url.indexOf("http") > 0 || url.indexOf("HTTP") > 0) {
                var sp = url.indexOf("HTTP") > 0 ? "HTTP" : "http";
                var urlArray = url.split(sp);
                url = "http" + urlArray[1];
            }
        }
        return url;
    }
};