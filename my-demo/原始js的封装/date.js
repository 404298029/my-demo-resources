layui.define('jquery', function (exports) {
    var $ = layui.$;

    // 我们需要将此方法使用顶层 layui
    // 这样可以确保每个子层都可以使用
    // 我们需要获取顶层 layui 对象
    var MODULE_NAME = 'event_handler'
    var isTop = top === self;//self（对当前窗口的引用，和顶层窗口做对比，是否是同一个窗口）
    var _layui = isTop ? layui : top.layui
    /**
     * 不同iframe 之间通过事件监听通讯
     * 示例：
     * 向特定iframe发送消息
     * EventHandler.$emit('on-children', { message: 'from father: ' + message })
     *  })；
     * 监听某个iframe发送来的特定消息
     * EventHandler.$on('on-children', function(data) {
     * 	 * $('#lay-output').html(data.message)
     * })
     */
    var EventHandler = {
        // 事件监听
        $on: function (eventType, callback) {
            return _layui.onevent.call(this, MODULE_NAME, eventType, callback)
        },

        // 事件响应
        $emit: function (eventType, params) {
            _layui.event.call(this, MODULE_NAME, eventType, params)
        }
    }





    /**
     * 字符串格式化
     * 用法示例：
     * var template = "{0}欢迎你在{1}上给{0}留言，交流看法";
     * var author = "晴枫";
     * var site = "枫芸志";
     * var msg = String.format(template, author, site);
     */
    String.format = function (src) {
        if (arguments.length == 0) return null;
        var args = Array.prototype.slice.call(arguments, 1);
        return src.replace(/\{(\d+)\}/g, function (m, i) {
            return args[i];
        });
    };



    var Comm = {

        /**
         * 检测数据是否为空：未定义、空字符串、数组
         * @param {Object} value
         * @param {Object} allowEmptyString
         */
        isEmpty: function (value, allowEmptyString) {
            return (value === null) ||
                (value === undefined) ||
                (!allowEmptyString ? value === '' : false) ||
                (this.isArray(value) && value.length === 0);
        },
        /**
         * 判断该对象是否为数组对象
         * @param {Object} value
         */
        isArray: function (value) {
            ('isArray' in Array) ? Array.isArray : function (value) {
                return toString.call(value) === '[object Array]';
            }
        },
        /**
         * 判断变量是否为字符串类型
         * @param {Object} str
         */
        isString: function (str) {
            return (typeof func != "undefined" && typeof str !== 'string');
        },
        /**
         * 判断是否是函数
         * @param {Object} func
         */
        isFunction: function (func) {
            return (typeof func != "undefined" && $.isFunction(func));
        }
    }
    //画布操作
    var MyCanvas = {
        drawImgByAutoZoomFit: function (cxt, srcImg, maxWidth, maxHeight) {
            if (Comm.isEmpty(srcImg.width)) {
                return;
            }
            var imgW = srcImg.width || 1;
            var imgH = srcImg.height || 1;
            var result = {
                planX: 0,
                planY: 0,
                zoomBL: 1.0
            };
            var x0 = 0,
                y0 = 0;
            var bl;
            var x1 = 0,
                y1 = 0;
            var dstW = 0,
                dstH = 0;
            var b1 = maxWidth / imgW;
            var b2 = maxHeight / imgH;
            bl = b1 > b2 ? b2 : b1;
            dstW = imgW * bl;
            dstH = imgH * bl;
            x1 = (maxWidth - dstW) / 2;
            y1 = (maxHeight - dstH) / 2;
            try {
                cxt.drawImage(srcImg, x0, y0, imgW, imgH, x1, y1, dstW, dstH);
            } catch (e) {

            }

            result.planX = x1;
            result.planY = y1;
            result.zoomBL = bl;
            return result;
        }

    };

    //时间操作
    var DateTime = {
        /**
         * 将date类型转换成format所需
         * @param Date 日期
         * @param format  所需格式
         * 
         * 
         */
        dateFormat: function (d, format) {
            if (Comm.isEmpty(d)) {
                format = "";
            } else {
                var date = {
                    "M+": d.getMonth() + 1,
                    "D+": d.getDate(),
                    "h+": d.getHours(),
                    "m+": d.getMinutes(),
                    "s+": d.getSeconds()
                };
                if (/(Y+)/i.test(format)) {
                    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                for (var k in date) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                            date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                    }
                }
            }
            return format;
        },
        /**
         * 将数据
         * "YYYYMMDDHHMMSS"转换为日期格式“YYYY-MM-DD HH:MM:SS”
         * render
         * 
         */
        dateTimeToDateTimeStr: function (value) {
            var returnStr = '';
            if (value != 'undefined' && value != '') {
                if (value.length == 14) {
                    returnStr = DateTime.dateTimeToDateStr(value) + " " + DateTime.dateTimeToTimeStr(value);
                } else {
                    returnStr = value;
                }
            } else {
                returnStr = '';
            }
            return returnStr;
        }
        /**
         * 将数据
         * "YYYYMMDD"或"YYYYMMDDHHMMSS"转换为
         * 日期格式“YYYY-MM-DD”
         * render
         * 
         */
        ,
        dateTimeToDateStr: function (value) {
            var returnStr = '';
            if (value != 'undefined' && value != '') {
                if (value.length == 8 || value.length == 14) {
                    returnStr = value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8)
                } else {
                    returnStr = value;
                }
            } else {
                returnStr = '';
            }
            return returnStr;
        }
        /**
         * 将数据
         * "YYYYMMDDHHMMSS"转换为日期格式“HH:MM:SS”
         * render
         * 
         */
        ,
        dateTimeToTimeStr: function (value) {
            var returnStr = '';
            if (value != 'undefined' && value != '') {
                if (value.length == 14) {
                    returnStr = value.substring(8, 10) + ":" + value.substring(10, 12) + ":" + value.substring(12, 14)
                } else {
                    returnStr = value;
                }
            } else {
                returnStr = '';
            }
            return returnStr;
        }
        /**
         * 将YYYY-MM-DD hh:mm:ss转YYYYMMDDhhmmss
         * @param str
         * @returns
         */
        ,
        dateTimeStrToDateTime: function (str) {
            var dateStr = "";
            if (!Comm.isEmpty(str)) {
                dateStr = DateTime.dateFormat(new Date(str), 'YYYYMMDDhhmmss');
            }
            return dateStr;
        }
        /**
         * 将YYYY-MM-DD hh:mm:ss转YYYYMMDD
         * @param str
         * @returns
         */
        ,
        dateTimeStrToDate: function (str) {
            var dateStr = "";
            if (!Comm.isEmpty(str)) {
                dateStr = DateTime.dateFormat(new Date(str), 'YYYYMMDD');
            }
            return dateStr;
        }
        /**
         * 将YYYY-MM-DD转YYYYMMDD
         * @param str
         * @returns
         */
        ,
        dateStrToDateStr: function (str) {
            var dateStr = "";
            if (!Comm.isEmpty(str)) {
                str = str + ' 00:00:00';
                dateStr = DateTime.dateFormat(new Date(str), 'YYYYMMDD');
            }
            return dateStr;
        }
        /**
         * 计算n天之前的日期
         */
        ,
        getBeforeDate: function (s) {
            // s = s - 1;
            var d = new Date();
            d.setDate(d.getDate() - s);
            return d;
        }

        /**
         * 计算n天，周，月，年之前的日期
         */
        ,
        getPreviouslyDate: function (type, number) {
            var nowdate = new Date();
            switch (type) {
                case "day": //取number天前、后的时间
                    nowdate.setTime(nowdate.getTime() + (24 * 3600 * 1000) * number);
                    var y = nowdate.getFullYear();
                    var m = nowdate.getMonth() + 1;
                    var d = nowdate.getDate();
                    if (m < 10) {
                        m = "0" + m
                    }
                    if (d < 10) {
                        d = "0" + d
                    }
                    var retrundate = y + "" + m + "" + d;
                    break;
                case "week": //取number周前、后的时间
                    var weekdate = new Date(nowdate + (7 * 24 * 3600 * 1000) * number);
                    var y = weekdate.getFullYear();
                    var m = weekdate.getMonth() + 1;
                    var d = weekdate.getDate();
                    if (m < 10) {
                        m = "0" + m
                    }
                    if (d < 10) {
                        d = "0" + d
                    }
                    var retrundate = y + "" + m + "" + d;
                    break;
                case "month": //取number月前、后的时间
                    nowdate.setMonth(nowdate.getMonth() + number);
                    var y = nowdate.getFullYear();
                    var m = nowdate.getMonth() + 1;
                    var d = nowdate.getDate();
                    if (m < 10) {
                        m = "0" + m
                    }
                    if (d < 10) {
                        d = "0" + d
                    }
                    var retrundate = y + "" + m + "" + d;
                    break;
                case "year": //取number年前、后的时间
                    nowdate.setFullYear(nowdate.getFullYear() + number);
                    var y = nowdate.getFullYear();
                    var m = nowdate.getMonth() + 1;
                    var d = nowdate.getDate();
                    if (m < 10) {
                        m = "0" + m
                    }
                    if (d < 10) {
                        d = "0" + d
                    }
                    var retrundate = y + "" + m + "" + d;
                    break;
                default: //取当前时间
                    var y = nowdate.getFullYear();
                    var m = nowdate.getMonth() + 1;
                    var d = nowdate.getDate();
                    var retrundate = y + "" + m + "" + d;
            }
            return retrundate;
        }
        /**
         * 根据开始结束时间 获取时间段中的日期
         * 
         * @param start （yyyy-MM-DD HH:mm:ss）
         * @param end（yyyy-MM-DD HH:mm:ss）
         * @returns
         */
        ,
        getDateArryByDateTime: function (start, end, format) {
            var startTime = new Date(start);
            var endTime = new Date(end);
            return DateTime.getDateArryByDate(startTime, endTime, format);
        }

        ,
        getDateArryByDate: function (startTime, endTime, format) {
            var dateArry = new Array();
            while ((endTime.getTime() - startTime.getTime()) >= 0) {
                var d = DateTime.dateFormat(startTime, format);
                dateArry.push(d);
                startTime.setDate(startTime.getDate() + 1);
            }
            dateArry = MyArray.unique(dateArry);
            return dateArry;
        }
        /**
         * 根据开始结束时间 获取时间段中的月份
         * 
         * @param d1
         *            （yyyy-MM）
         * @param d2（yyyy-MM）
         * @returns
         */
        ,
        getMonthArry: function (d1, d2, format) {
            var dateArry = new Array();
            var startTime = DateTime.getDate(d1);
            var endTime = DateTime.getDate(d2);
            while ((endTime.getTime() - startTime.getTime()) >= 0) {
                var d = DateTime.dateFormat(startTime, format);
                dateArry.push(d);
                startTime.setMonth(startTime.getMonth() + 1);
            }
            dateArry = MyArray.unique(dateArry);
            return dateArry;
        },

        /**
         * 根据时间字符串返回date
         * (yyyy-MM)
		*/
        getDate: function (datestr) {
            var temp = datestr.split("-");
            var date = new Date();
            if (temp.length == 2) {
                date.setDate(1);
                date.setFullYear(temp[0], parseInt(temp[1]) - 1);
            }
            return date;
        },

        /**
         * 获取间隔月份
         * param 格式YYYY-MM ~ YYYY-MM
         */

        getIntervalMonth: function (param) {
            var d = param.split(' ~ ');
            var startDate = DateTime.getDateByStr(d[0]);
            var endDate = DateTime.getDateByStr(d[1]);
            var startMonth = startDate.getMonth();
            var endMonth = endDate.getMonth();
            var intervalMonth = (endDate.getFullYear() * 12 + endMonth) - (startDate.getFullYear() * 12 + startMonth);
            return intervalMonth;
        }
        /**
         * 将数据
         * "YYYYMMDD"或"YYYYMMDDHHMMSS"转换为
         * 日期格式“YYYY-MM-DD”
         * render
         * 
         */
        ,
        dateTimeToDateStr: function (value) {
            var returnStr = '';
            if (value != 'undefined' && value != '') {
                if (value.length == 8 || value.length == 14) {
                    returnStr = value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8)
                } else {
                    returnStr = value;
                }
            } else {
                returnStr = '';
            }
            return returnStr;
        }
        /**
         * 两个时间相差分钟数
         * @param start （yyyy-MM-DD HH:mm:ss
         * @param end（yyyy-MM-DD HH:mm:ss）
         * @returns
         */
        ,
        getInervalMinute: function (start, end) {
            var startDate = new Date(start);
            var endDate = new Date(end);
            var ms = endDate.getTime() - startDate.getTime();
            if (ms < 0) return 0;
            return Math.floor(ms / 1000 / 60);
        }
        /**
         * 两个时间相差天数
         * @param YYYY-MM-DD ~ YYYY-MM-DD
         * @return 
         * 
         */
        ,
        getInervalDays: function (dateStr) {
            var d = dateStr.split(' ~ ');
            var star = DateTime.getDateByStr(d[0]);
            var end = DateTime.getDateByStr(d[1]);
            return (end - star) / (1000 * 60 * 60 * 24);
        }

        /**
         * 获取两个时间相差天数及对应的时间对象
         * @param YYYY-MM-DD ~ YYYY-MM-DD
         * @return 
         * 
         */
        ,
        getDateAndInervalDays: function (dateStr) {
            var obj = {};
            var d = dateStr.split(' ~ ');
            obj.star = DateTime.getDateByStr(d[0]);
            obj.end = DateTime.getDateByStr(d[1]);
            obj.value = (obj.end - obj.star) / (1000 * 60 * 60 * 24);
            return obj;
        }
        /**
         * 将时间字符串转时间对象
         * @param (YYYY-MM-DD)
         */
        ,
        getDateByStr: function (dateStr) {
            var date = dateStr.split('-');
            var s = date[1] + "/" + date[2] + "/" + date[0];
            return new Date(s);
        }
        /**
         * 将字符串转时间对象
         * 并设置时分秒
         * @param (YYYY-MM-DD)
         * @param 是否是开始时间默认false
         * 
         */
        ,
        getDateTimeByStr: function (str, isStart) {
            isStart = isStart || false;
            var now = new Date();
            var newDate = DateTime.getDateByStr(str);
            if (isStart) {
                newDate.setHours(0);
                newDate.setMinutes(0);
                newDate.setSeconds(0);
            } else {
                if (now.toDateString() === newDate.toDateString()) { //判断是否是今天
                    newDate.setHours(now.getHours());
                    newDate.setMinutes(now.getMinutes());
                    newDate.setSeconds(now.getSeconds());
                } else {
                    newDate.setHours(23);
                    newDate.setMinutes(59);
                    newDate.setSeconds(59);
                }
            }
            return newDate;
        },
        /**
         * 获取最近十二个月
         * 
         * @param 当前时间
         * @param 数量
         *            12
         * 
         */
        getTwelveLastMonth: function (d, format) {
            return DateTime.getLastYearMonth(d, 12, format);
        },


        getLastYearMonth: function (d, s, format) {
            var result = [];
            d.setDate(1);
            d.setMonth(d.getMonth() + 1) // 获取到当前月份,设置月份
            for (var i = 0; i < s; i++) {
                d.setMonth(d.getMonth() - 1); // 每次循环一次 月份值减1
                //		var m = (d.getMonth() + 1);
                // 在这里可以自定义输出的日期格式

                result.push(DateTime.dateFormat(d, format));
            }
            return result.reverse();
        },

        /**
         * 获取最近一个月
         * （30天）
         * @param 当前时间
         * @param 格式化
         * @param 是否包含今天
         */

        getThirtyLastDay: function (d, format, bool) {
            return DateTime.getLastMonthDay(d, 30, format, bool);
        },


        getLastMonthDay: function (d, s, format, bool) {
            var result = [];
            if (bool) { //默认不包含今天
                result.push(DateTime.dateFormat(d, format));
            }
            for (var i = 0; i < s; i++) {
                d.setDate(d.getDate() - 1); // 每次循环一次减1
                var t = d.getDate();
                // 在这里可以自定义输出的日期格式
                result.push(DateTime.dateFormat(d, format));
            }
            return result.reverse();
        },
        /**
         * 格式化时间字符串为指定格式
         * @param date (YYYYMMDD)
         * @param time(hhmm)
         * @return MM-DD hh:mm
         * 
         */
        formatDateTimeStrToMmDdHhMm: function (date, time) {
            var str = '';
            if (date.length == 8) {
                str = date.substring(4, 6) + "-" + date.substring(6, 8) + " ";
            }
            if (time.length == 4) {
                str += time.substring(0, 2) + ":" + time.substring(2, 4);
            }
            return str;
        }
    }

    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val)
                return i;
        }
        return -1;
    };

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    Array.prototype.removeByIndex = function (dx) {
        if (isNaN(dx) || dx > this.length) { return false; }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[dx]) {
                this[n++] = this[i]
            }
        }
        this.length -= 1
    }


    var MyArray = {
        unique: function (arr) {
            return Array.from(new Set(arr));
        },
        //判断是否是数组
        isArray: function (value) {
            if (typeof Array.isArray === "function") {
                return Array.isArray(value);
            } else {
                return Object.prototype.toString.call(value) === "[object Array]";
            }
        },

        /**
         * 按指定长度截取数组
         * 返回新数组
         * @param 数组
         * @param 长度
         */
        splitArrayByNum: function (e, l) {
            if (Comm.isEmpty(l)) {
                return e;
            }
            var num = 0;
            var _data = [];
            for (let i = 0; i < e.length; i++) {
                if (i % l == 0 && i != 0) {
                    _data.push(e.slice(num, i));
                    num = i;
                }
                if ((i + 1) == e.length) {
                    _data.push(e.slice(num, (i + 1)));
                }
            }
            return _data;
        },
        /**
         * 获取两个数组
         * 对应下标值不同的下标数组
         * @param {} q 新数组
         * @param {} c 原数组 
         */
        getIndexOfDifference: function (q, c) {
            var p = [];
            var maxlen = Math.max(q.length, c.length);
            var minlen = Math.min(q.length, c.length);
            for (var i = 0; i < maxlen; i++) {
                if (minlen <= i) {
                    p.push(i);
                } else {
                    if (q[i] != c[i]) {
                        p.push(i);
                    }
                }
            }
            return p;
        },

        /**
         * 数组元素相加返回新数组
         * @param {Object} arr1 原数组
         * @param {Object} arr2 被加数组
         * 
         */
        sumItem: function (arr1, arr2) {
            if (arr2.length == 0) {
                return arr1;
            } else {
                arr1.map(function (value, index) {
                    arr2[index] += value;
                })
            }
            return arr2;
        }
    }


    //------------------------------------------父页面，子页面交互标准接口定义--------------------------------------------------------
    var IframeOpt = {
        ParentWin: {
            /**
             * 父页面提供的标准接口函数名称
             */
            funName: {
                getDataFun: "getDataFun", //子页面调用，提供给子页面的数据接口
                updateDataFun: "updateDataFun", //子页面调用，向父页面提交数据接口
                closeFun: "closeFun" //子页面需要关闭时，调用父页面的关闭窗口接口
            },
            /**
             * yening 2017.8.24
             * 父页面设置需要提供给子页面的接口函数
             * @param childWinId ：要使用的子页面对应接口的id，该id需要与子页面中定义的id一致
             * @param functionName  ： 需要注册的回调函数名称，接口名称只能是ViFS.ParentWin.funName中定义的名称
             * @param callbackFun ：子页面数据向父页面更新数据时的回调函数,接口入参为js对象
             */
            setFunForChild: function (childWinId, functionName, callbackFun) {
                if (Comm.isEmpty(childWinId)) {
                    alert("没有为子页面调用接口定义对象Id");
                    return;
                }
                //保存父页面提供给子页面调用的接口总对象
                if (Comm.isEmpty(window.childCallbackObj)) {
                    window.childCallbackObj = {};
                }
                //与指定子页面对应的回调接口对象
                var childCallbackObj = window.childCallbackObj;
                if (Comm.isEmpty(childCallbackObj[childWinId])) {
                    childCallbackObj[childWinId] = {};
                }

                var childObj = childCallbackObj[childWinId];
                if (!Comm.isEmpty(childObj[functionName])) {
                    alert("子页面" + childWinId + " 所需调用接口已存在" + functionName);
                    return;
                }
                //检查接口是否为注册的接口
                for (var pro in IframeOpt.ParentWin.funName) {
                    if (IframeOpt.ParentWin.funName[pro] == functionName) {
                        childObj[functionName] = callbackFun;
                        return;
                    }
                }
                alert("子页面 " + childWinId + " 所需调用接口未注册：" + functionName + "。请检查接口定义声明对象。");
            }

        },
        ChildWin: {
            /**
             * 2017.8.23
             * 检查指定的子页面调用接口是否存在
             */
            checkValid: function (childWinId, funName) {
                var parentWin = window.parent;
                var childCallbackObj = parentWin.childCallbackObj;
                if (Comm.isEmpty(childWinId)) {
                    alert("子页面调用接口定义对象Id不能为空！");
                    return false;
                }
                if (Comm.isEmpty(childCallbackObj)) {
                    alert("父页面调用接口定义的对象不存在");
                    return false;
                }
                var childObj = childCallbackObj[childWinId];
                if (Comm.isEmpty(childObj)) {
                    alert("子页面调用接口定义的对象不存在");
                    return false;
                }
                if (Comm.isEmpty(childObj[funName])) {
                    alert("父页面调用接口定义不存在:" + funName);
                    return false;
                }
                return true;
            }

            /**
             * yening 2017.8.24
             * 子页面调用父页面的接口函数
             * @childWinId ：子页面定义的自身页面Id
             * @funcName ： 需要调用的回调函数名称
             * @params ：  需要传递的参数
             * @return :如果函数有返回值则通过其进行返回
             */
            ,
            callBack: function (childWinId, funcName, params) {
                if (!IframeOpt.ChildWin.checkValid(childWinId, funcName)) {
                    return;
                }

                var parentWin = window.parent;
                var childObj = parentWin.childCallbackObj[childWinId];
                return childObj[funcName].call(parentWin, params);
            }

        }
    };


    exports("tools", {
        Comm: Comm,
        MyCanvas: MyCanvas,
        DateTime: DateTime,
        MyArray: MyArray,
        IframeOpt: IframeOpt
    });

});