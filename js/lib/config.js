var Config = {
    url: {
        //域名
        domain: function () {
            return "http://easyerp.linderun.com";
        },

        //请求后台
        postHtml: function () {
            return this.domain() + '/crawl/postHtml';
        }
    },

    platform: function () {
        return [
            "aliexpress"
        ];
    }
}