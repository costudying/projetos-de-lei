var DOMQuery = (function () {
    function DOMQuery() {
    }
    DOMQuery.find = function (query) {
        return $(query);
    };
    return DOMQuery;
}());
///<reference path="./DOMQuery.ts" />
var ModuleController = (function () {
    function ModuleController(container, template) {
        if (container === void 0) { container = null; }
        this.container = container;
        this.template = template;
        this.$scope = {};
        this.children = {};
    }
    ModuleController.prototype.render = function () {
        var _this = this;
        if (this.container) {
            this.container.innerHTML = this.template(this.$scope);
            this.includeProc();
            this.bindIf();
            this.bindPartial();
            this.bindLink();
            this.bindProc();
            this.bindModel();
            Object.keys(this.children).forEach(function (key) {
                var child = _this.children[key];
                child.render();
            });
        }
    };
    ModuleController.prototype.includeProc = function () {
        var _this = this;
        $(this.container).find("[pf-include]").each(function (index, elem) {
            var controller = _this.children[$(elem).attr("pf-include")];
            if (controller)
                controller.container = elem;
        });
    };
    ModuleController.prototype.bindLink = function () {
        $(this.container).find("[pf-link]").each(function (elementIndex, elem) {
            elem.href = $(elem).attr("pf-link");
            $(elem).click(function (evt) {
                if (ModuleController.routeFunction) {
                    ModuleController.routeFunction($(elem).attr("pf-link"));
                    evt.stopPropagation();
                    evt.preventDefault();
                }
            });
        });
    };
    ModuleController.prototype.eval = function (cmd, elem, evt) {
        var _this = this;
        var values = Object.keys(this.$scope).map(function (key) {
            return _this.$scope[key];
        });
        var keys = Object.keys(this.$scope);
        return Function.apply(elem, keys.concat("event").concat(cmd)).apply(elem, values.concat(evt));
    };
    ModuleController.prototype.bindPartial = function () {
        var _this = this;
        if (!ModuleController.templateMap)
            return;
        $(this.container).find("[pf-partial]").each(function (elementIndex, elem) {
            elem.innerHTML = ModuleController.templateMap[$(elem).attr("pf-partial")](_this.$scope);
        });
    };
    ModuleController.prototype.bindProc = function () {
        var _this = this;
        var events = ["click", "keyup", "keypress", "change"];
        $(events).each(function (evtIndex, evt) {
            $(_this.container).find("[pf-" + evt + "]").each(function (elementIndex, elem) {
                var cmd = $(elem).attr("pf-" + evt);
                var keys = Object.keys(_this.$scope);
                var values = Object.keys(_this.$scope).map(function (key) {
                    return _this.$scope[key];
                });
                elem["on" + evt] = function (event) { Function.apply(elem, keys.concat("event").concat(cmd)).apply(elem, values.concat(event)); };
            });
        });
        $(this.container).find("[pf-hover]").each(function (elementIndex, elem) {
            var cmd = $(elem).attr("pf-hover");
            var keys = Object.keys(_this.$scope);
            var values = Object.keys(_this.$scope).map(function (key) {
                return _this.$scope[key];
            });
            elem["onmouseover"] = function (event) { Function.apply(elem, keys.concat("event").concat(cmd)).apply(elem, values.concat(event)); };
        });
    };
    ModuleController.prototype.bindIf = function () {
        var _this = this;
        $(this.container).find("[pf-if]").each(function (elementIndex, elem) {
            var cmd = $(elem).attr("pf-if");
            if (!_this.eval(cmd, elem, undefined))
                elem.remove();
        });
    };
    ModuleController.prototype.bindModel = function () {
        var _this = this;
        $(this.container).find("[pf-model]").each(function (elementIndex, elem) {
            var path = $(elem).attr("pf-model");
            var indexAccess = function (obj, is, value) {
                if (value === void 0) { value = undefined; }
                if (typeof is == 'string')
                    return indexAccess(obj, is.split('.'), value);
                else if (is.length == 1 && value !== undefined)
                    return obj[is[0]] = value;
                else if (is.length == 0)
                    return obj;
                else
                    return indexAccess(obj[is[0]], is.slice(1), value);
            };
            $(elem).val(indexAccess(_this.$scope, path));
            $(elem).change(function () {
                indexAccess(_this.$scope, path, $(elem).val());
            });
        });
    };
    ModuleController.prototype._init = function () {
        var _this = this;
        this.init();
        Object.keys(this.children).forEach(function (key) {
            _this.children[key]._init();
        });
    };
    ModuleController.prototype.init = function () { };
    ModuleController.routeFunction = null;
    ModuleController.templateMap = null;
    return ModuleController;
}());
///<reference path="./ModuleController.ts"/>
var Router = (function () {
    function Router(mainController, routes) {
        var _this = this;
        this.go = function (path) {
            document.body.innerHTML = "";
            ga("send", "pageview", path);
            history.pushState(null, "", path);
            _this.render();
        };
        this.back = function () {
            history.back();
        };
        this.routes = routes;
        this.mainController = mainController;
    }
    Router.prototype.paramsFromPath = function (template, path) {
        var retval = {};
        if ((new RegExp(template.replace(/:\w+/, function (term, position) {
            retval[term.substr(1)] = path.substr(position).match(/\w+/)[0];
            return "\\w+";
        }))).test(path)) {
            return retval;
        }
        return {};
    };
    Router.prototype.render = function () {
        var _this = this;
        Object.keys(this.routes).forEach(function (route) {
            var regex = new RegExp("^" + route.replace(/:\w+/g, "\\w+") + "$");
            if (regex.test(location.pathname)) {
                _this.mainController.children.yield = _this.routes[route]();
                //Filling params
                _this.params = _this.paramsFromPath(route, location.pathname);
                location.search.substr(1).split(/&/).forEach(function (pair) {
                    var _a = pair.split("="), k = _a[0], v = _a[1];
                    if (k != "")
                        _this.params[k] = decodeURI(v);
                });
            }
        });
        this.mainController._init();
        this.mainController.render();
    };
    Router.prototype.init = function () {
        var _this = this;
        window.onpopstate = function () {
            document.body.innerHTML = "";
            history.pushState(null, "", "");
            _this.render();
        };
        this.render();
    };
    Router.prototype.fake = function (path, params) {
        if (params === void 0) { params = {}; }
        var paramsString = "?" + Object.keys(params).map(function (key) {
            return encodeURI(key) + "=" + encodeURI(params[key]);
        }).join("&");
        ga("send", "pageview", path + paramsString);
        history.pushState(null, "", path + paramsString);
    };
    return Router;
}());
var Loader;
(function (Loader) {
    var div = $("<div class=loader>");
    var queue = 0;
    function start() {
        div.appendTo(document.body);
    }
    Loader.start = start;
    function stop() {
        if (queue == 0)
            div.detach();
    }
    Loader.stop = stop;
})(Loader || (Loader = {}));
///<reference path="../Loader.ts"/>
var AJAXCall = (function () {
    function AJAXCall() {
    }
    AJAXCall.toParams = function (node, obj) {
        var _this = this;
        if (node === void 0) { node = null; }
        if (obj && typeof (obj) === "object") {
            return Object.keys(obj).map(function (key) {
                if (node) {
                    return _this.toParams(node + "[" + key + "]", obj[key]);
                }
                else {
                    return _this.toParams(key, obj[key]);
                }
            }).join("&");
        }
        else {
            return node + "=" + encodeURI(obj);
        }
    };
    AJAXCall.http = function (method, url, params, success, error) {
        if (error === void 0) { error = AJAXCall.errorFunction; }
        Loader.start();
        $.ajax({
            url: url,
            type: method,
            crossDomain: true,
            data: params,
            dataType: "json",
            success: function (data) {
                Loader.stop();
                success(data);
            },
            error: function (data) {
                error(data.responseJSON);
                Loader.stop();
            }
        });
    };
    AJAXCall.get = function (path, params, callback, error) {
        if (error === void 0) { error = AJAXCall.errorFunction; }
        this.http("GET", path, params, callback, error);
    };
    AJAXCall.post = function (path, params, callback, error) {
        if (error === void 0) { error = AJAXCall.errorFunction; }
        this.http("POST", path, params, callback, error);
    };
    AJAXCall.put = function (path, params, callback, error) {
        if (error === void 0) { error = AJAXCall.errorFunction; }
        this.http("PUT", path, params, callback, error);
    };
    AJAXCall.destroy = function (path, params, callback, error) {
        if (error === void 0) { error = AJAXCall.errorFunction; }
        this.http("DELETE", path, params, callback);
    };
    AJAXCall.errorFunction = function (error) {
        alert("Error!");
        console.error(error);
    };
    return AJAXCall;
}());
///<reference path="./paperFrame/Router.ts" />
///<reference path="./paperFrame/AJAXCall.ts" />
///<reference path="./paperFrame/ModuleController.ts" />
//Main function
var router;
var Templates = {};
window.onload = function () {
    var app = new ModuleController(document.body, Templates["teste"]);
    router = new Router(app, {
        "/": function () { return new ModuleController(document.body, Templates["teste"]); }
    });
    ModuleController.routeFunction = router.go;
    ModuleController.templateMap = Templates;
    router.init();
};

Templates["teste"]=function(scope){
	var include=function(path,extra){
		var newScope = new Object(extra) || {};
		for(attr in scope){
			newScope[attr]=scope[attr];
		}
		return Templates[path](newScope);
	}
	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;',
		"/": '&#x2F;'
	  };

	  function escapeHtml(string) {
		return String(string).replace(/[&<>"'/]/g, function (s) {
		  return entityMap[s];
		});
	  }
	with(scope||{}){
		var _out = [];
		_out.push("teste\n");
		return _out.join("");
	}
};
