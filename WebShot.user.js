// ==UserScript==
// @name         WebShot
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/maoger/WebShot
// @version      0.6.2
// @description  快捷键“Shift + A”，获取整个网页的截图。
// @author       Maoger
// @include      http*://*
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @require      https://html2canvas.hertzen.com/dist/html2canvas.min.js
// @grant        GM_openInTab
// @updateURL    https://openuserjs.org/meta/maoger/WebShot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 打开所有的隐藏标签
    // 主要是针对工商信息网站《国家企业信用信息公示系统》，http://www.gsxt.gov.cn/
    var $content = $("#addmore");
    $content.click();

    // 点击打开所有“更多”
    // 这句容易出错，待核实
    //var $more = $("[onclick='showAllData('altInfoBe', 0)'']");
    //$more.click();

    // 截图函数
    function PageCap(){
        // 修复bug：如果没有这句脚本，将从视野可见区域开始往下截图
        // 功能：开始截图时，跳转到网页顶部
        window.scrollTo(0,0);
        // 或者可以使用如下方法，功能一样
        // $("body,html").scrollTop(0);

        // 利用html2canvas截图
        html2canvas(document.body, {
            // allowTaint : true,
            // useCORS : true,
            // taintTest : false,
            background : "#fff",
            onrendered : function(canvas) {
                // canvas.id = "mycanvas";
                // 生成base64图片数据
                var imgUrl = canvas.toDataURL();
                GM_openInTab(imgUrl);

            }
        });
    }

    // 设置快捷键：① “Shift + A”截图，② “Shift + /”获取提示
    // from: http://stackoverflow.com/a/12444641/1925954
    var keys = {};
    function test_key(selkey) {
        var alias = {
            "Ctrl": 17,
            "Shift": 16,
            "/": 191,
            "a": 65,
        };
        return keys[selkey] || keys[alias[selkey]];
    }
    function test_keys() {
        var i,
            keylist = arguments,
            status = true;
        for (i = 0; i < keylist.length; i++) {
            if (!test_key(keylist[i])) {
                // status = false;
                return false;
            }
        }
        return status;
    }
    function globalKeydown(event) {
        var keyCode = event.keyCode;
        keys[keyCode] = event.type === 'keydown';
        if (test_keys('Shift', 'a')) {
            PageCap();
            keys = {};
            return false;
        } else if (test_keys('Shift', '/')) {
            // ? => help
            alert('快捷键“Shfit + A”，获取整个网页截图！');
            keys = {};
            return false;
        }
    }
    function globalKeyup(event) {
        var keyCode = event.keyCode;
        keys[keyCode] = false;
    }
    $(document).keydown(globalKeydown).keyup(globalKeyup);
})();
