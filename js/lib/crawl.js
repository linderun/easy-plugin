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
        crawlObj && crawlObj.crawl(info.url, function (data) {
            console.info('data:', data);
            if (data.html) {
                Html.postHtml(Config.url.postHtml(), data, 0, function (result) {
                    console.info('result:', result);
                });
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