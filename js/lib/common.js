var Common = {
    'deleteUrlQueryParam': function (name, baseUrl, originUrl) {
        var query = originUrl.substring(originUrl.indexOf('?') + 1);

        var obj = {};
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        }

        if (query.indexOf(name) > -1) {
            delete obj[name];
        }

        return baseUrl + JSON.stringify(obj)
            .replace(/[\"\{\}]/g, "")
            .replace(/\:/g, "=")
            .replace(/\,/g, "&");
    }
};