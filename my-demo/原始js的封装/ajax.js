layui.define(['jquery', 'tools', 'localData'], function (exports) {
	var $ = layui.$;
	var Comm = layui.tools.Comm;
	var LocalData = layui.localData;

	/**
	 * ajax数据请求
	 */

	var Ajax = {

	}
	//Ajax提交,带认证信息
	Ajax.Post = function (url, jsonData, successFunc, errorFunc, asyncFlag) {
		if (Comm.isEmpty(asyncFlag)) {
			asyncFlag = true;
		}
		$.ajax({
			type: "post",
			url: this.WebUrl.formatUrl(url),
			data: jsonData,
			dataType: 'json',
			async: asyncFlag,
			error: function (e) {
				if (errorFunc != null) {
					errorFunc(e);
				} else {
					var err = JSON.stringify(e, null, 4).replace(/\\/g, "");
					console.log(err);
				}
			},
			success: function (e) {
				if (e.code == "401") {
					top.location.href = '/view/login.html';
				};
				if (typeof successFunc != "undefined" && $.isFunction(successFunc)) {
					successFunc(e);
				}
			},
			headers: {
				'Authorization': LocalData.getToken()
			}
		});
	}
	//Ajaxget请求
	Ajax.Get = function (url, jsonData, successFunc) {
		$.ajax({
			type: "GET",
			url: this.WebUrl.formatUrl(url),
			data: jsonData,
			dataType: 'json',
			success: function (e) {
				if (e.code == "401") {
					top.location.href = '/view/login.html';

					//				layer.alert(e.msg, {
					//					icon : 2,
					//					title : '系统提示'
					//				}, function() {
					//					return top.location.href = '/view/login.html';
					//				});
				};
				successFunc(e);
			},
			headers: {
				'Authorization': LocalData.getToken()
			}
		});
	}
	Ajax.refreshToken = function () {
		Ajax.Post("/admin/token/refresh", {}, function (data) {
			var token = data.data;
			LocalData.setToken(token);
			console.log("new token=" + token);
		});
	}

	//ajax 提交,同步模式提交
	Ajax.Submission = function (mode, url, jsonData, successFunc, errorFunc) {
		$.ajax({
			type: mode,
			url: this.WebUrl.formatUrl(url),
			data: jsonData,
			dataType: 'json',
			async: false,
			error: function (e) {
				if (errorFunc != null) {
					errorFunc(e);
				} else {
					alert(e);
				}
			},
			success: function (e) {
				if (e.code == "401") {
					layer.alert(e.msg, {
						icon: 2,
						title: '系统提示'
					}, function () {
						return top.location.href = '/view/login.html';
					});
				};
				successFunc(e);
			},
			headers: {
				'Authorization': LocalData.getToken()
			}
		});
	}
	//Ajax.baseUrl = "http://127.0.0.1:8081"; //用于web服务端直接访问模式
	Ajax.WebUrl = {
		baseUrl: "/web", //用于nginx代理模式
		formatUrl: function (url) {
			return this.baseUrl + url;
		}
	}

	//静态资源路径
	Ajax.DatumUrl = {
		baseUrl: "/web/file",
		formatUrl: function (url) {
			return this.baseUrl + url;
		}
	}

	/**
	 * 枚举数据
	 */
	//全局共享数据，所以数据放在顶层页面
	top.enumDataMap_XXX = top.enumDataMap_XXX || {};
	Ajax.EnumData = {

		// 执行AJAX请求
		getEnumData: function () {
			if ($.isEmptyObject(top.enumDataMap_XXX)) {
				Ajax.Submission("post", "/admin/getEnumList", "", function (data) {
					for (var i = 0; i < data.data.length; i++) {
						var key1 = data.data[i].enum_key;
						var key2 = data.data[i].element_key;
						if (top.enumDataMap_XXX[key1] == undefined) {
							top.enumDataMap_XXX[key1] = {};
						}
						top.enumDataMap_XXX[key1][key2] = data.data[i];
					};
				}, function (data) {
					layer.msg(data.msg);
				});
			}
		},

		/**
		 * 根据key获取数据，如果不传参数则返回整个数据集，指定一个参数返回一类数据，指定两个参数则返回一个枚举对象
		 * @param {Object} key1：枚举分类
		 * @param {Object} key2：枚举键值
		 */
		getData: function (key1, key2) {
			var data;
			if (key1 == undefined) {
				data = top.enumDataMap_XXX;
			} else if (key2 == undefined) {
				data = top.enumDataMap_XXX[key1];
			} else {
				data = top.enumDataMap_XXX[key1][key2];
			}
			if (Comm.isEmpty(data)) {
				data = {};
			}
			return data;
		},

		/**
		 * 根据key获取对应值
		 * @param {Object} key1
		 * @param {Object} key2
		 */
		getValue: function (key1, key2) {
			if (key1 == undefined) {
				return "";
			} else if (key2 == undefined) {
				return "";
			}
			var eValue = top.enumDataMap_XXX[key1][key2];
			if (eValue == null || eValue == undefined) {
				return "";
			}
			return eValue.element_value;
		}
	};

	/**
	 * 平台全局参数
	 * @author chenbin
	 */
	top.paramMap_XXX = top.paramMap_XXX || {};
	Ajax.ParamData = {

		// 执行AJAX请求
		getParamData: function () {
			if ($.isEmptyObject(top.paramMap_XXX)) {
				Ajax.Submission("post", "/admin/param/list", "", function (datas) {
					for (var i = 0; i < datas.data.length; i++) {
						var param_key = datas.data[i].param_key;
						top.paramMap_XXX[param_key] = datas.data[i];
					}
				}, function (data) {
					layer.msg(data.msg);
				});
			}
		},
		// 根据key获取数据
		getData: function (key1) {
			if (key1 == undefined) {
				return top.paramMap_XXX;
			}
			return top.paramMap_XXX[key1];
		}
	};

	/**
	 * 权限
	 */
	top.permissionMap_XXXX = top.permissionMap_XXXX || {};
	Ajax.Authority = {


		//执行AJAX请求
		loadPermissionData: function () {
			if ($.isEmptyObject(top.permissionMap_XXXX)) {
				Ajax.Submission("post", "/admin/permission/loadPermission", {
					user_id: LocalData.getUser().id
				}, function (data) {
					//			console.log(data);
					top.permissionMap_XXXX = data.data;
				}, function (data) {
					layer.msg(data.msg);
				});
			}
		},

		/**
		 * 权限判断
		 */
		check: function (url) {
			var flag = true;
			if (top.permissionMap_XXXX.hasOwnProperty(url)) {
				flag = top.permissionMap_XXXX[url] == 0 ? false : true;
			}
			return flag;
		},

		/**
		 * dom节点显示操作
		 * @param {Object} domId
		 * @param {Object} flag: true显示，false隐藏
		 */
		show: function (domId, flag) {
			var vm = new Vue({
				el: domId,
				data: {
					isShow: flag,
				}
			});
		},
		/**
		 * 根据权限显示
		 */
		isShowByRight: function (url, domId) {
			this.show(domId, this.check(url));
		}
	};

	Ajax.Url = {
		/**
		 * 获取url地址中参数对应的值，name:参数名称
		 * @param {Object} name
		 * @param {Object} isDecode 是否解码（默认解码）不解码传false
		 * 
		 */
		getUrlParamValue: function (name, isDecode) {
			isDecode = Comm.isEmpty(isDecode) ? true : false;
			let tstr = window.location.href;
			let index = tstr.indexOf('?')
			let str = tstr.substring(index + 1);
			let arr = str.split('&');
			let result = {};
			arr.forEach(function (item) {
				let a = item.split('=');
				result[a[0]] = a[1];
			});
			if (Comm.isEmpty([name])) {

			} else {
				if (isDecode) {
					return decodeURIComponent(result[name]);
				} else {
					return result[name];
				}
			}

		}
	}
	exports("ajax", Ajax);
});
