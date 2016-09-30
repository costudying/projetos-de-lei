
Templates["modal"]=function(scope){
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
		_out.push("<div class=\"list-group organic\">\n\t");
	 (laws.organic||[]).forEach(function(law){ ;
	_out.push("\n\t\t<div class=\"list-group-item\">\n\t\t\t<b class=\"list-group-item-heading\">\n\t\t\t\t<a href=\"//mail.camara.rj.gov.br");
			_out.push(escapeHtml( law.url));
			_out.push("\" target=\"_blank\">");
			_out.push(escapeHtml( law.id ));
			_out.push("</a>\n\t\t\t</b>\n\t\t\t<small>\n\t\t\t\t");
			_out.push(escapeHtml( law.date ));
			_out.push("\n\t\t\t</small>\n\t\t\t<p class=\"list-group-item-text\">\n\t\t\t\t");
			_out.push(escapeHtml( law.description.split("=>")[0] ));
			_out.push("\n\t\t\t</p>\n\t\t</div>\n\t");
	 }) ;
	_out.push("\n</div>\n<div class=\"list-group complementary\">\n\t");
	 (laws.complementary||[]).forEach(function(law){ ;
	_out.push("\n\t\t<div class=\"list-group-item\">\n\t\t\t<b class=\"list-group-item-heading\">\n\t\t\t\t<a href=\"//mail.camara.rj.gov.br");
			_out.push(escapeHtml( law.url));
			_out.push("\" target=\"_blank\">");
			_out.push(escapeHtml( law.id ));
			_out.push("</a>\n\t\t\t</b>\n\t\t\t<small>\n\t\t\t\t");
			_out.push(escapeHtml( law.date ));
			_out.push("\n\t\t\t</small>\n\t\t\t<p class=\"list-group-item-text\">\n\t\t\t\t");
			_out.push(escapeHtml( law.description.split("=>")[0] ));
			_out.push("\n\t\t\t</p>\n\t\t</div>\n\t");
	 }) ;
	_out.push("\n</div>\n<div class=\"list-group simple\">\n\t");
	 (laws.simple||[]).forEach(function(law){ ;
	_out.push("\n\t\t<div class=\"list-group-item\">\n\t\t\t<b class=\"list-group-item-heading\">\n\t\t\t\t<a href=\"//mail.camara.rj.gov.br");
			_out.push(escapeHtml( law.url));
			_out.push("\" target=\"_blank\">");
			_out.push(escapeHtml( law.id ));
			_out.push("</a>\n\t\t\t</b>\n\t\t\t<small>\n\t\t\t\t");
			_out.push(escapeHtml( law.date ));
			_out.push("\n\t\t\t</small>\n\t\t\t<p class=\"list-group-item-text\">\n\t\t\t\t");
			_out.push(escapeHtml( law.description.split("=>")[0] ));
			_out.push("\n\t\t\t</p>\n\t\t</div>\n\t");
	 }) ;
	_out.push("\n</div>\n");
		return _out.join("");
	}
};

Templates["profile"]=function(scope){
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
		_out.push("<div style=\"text-align:left\">\n\t<p><i class=\"fa fa-flag\"></i> ");
			_out.push(escapeHtml( party ));
			_out.push("</p>\n\t<p><i class=\"fa fa-envelope\"></i> ");
			_out.push(escapeHtml( email ));
			_out.push("</p>\n\t<p><i class=\"fa fa-phone\"></i> ");
			_out.push(escapeHtml( phone ));
			_out.push("</p>\n</div>\n");
		return _out.join("");
	}
};

Templates["laws"]=function(scope){
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
		_out.push("<div class=\"col-sm-12\">\n\t<button onclick=\"showModal('organic')\" class=\"btn btn-default btn-block\" style=\"text-align:center;padding:20px;margin-bottom:2em\">\n\t\t<h1 class=\"laws-counter clickable\">\n\t\t\t");
			_out.push(escapeHtml((organic||[]).length ));
			_out.push("\n\t\t</h1>\n\t\t<b onclick=\"showModal()\" class=\"clickable\">orgânicas</b>\n\t</button>\n</div>\n<div class=\"col-sm-6\">\n\t<button onclick=\"showModal('complementary')\" class=\"btn btn-default btn-block\" style=\"text-align:center;padding:20px\">\n\t\t<h1 class=\"laws-counter clickable\">\n\t\t\t");
			_out.push(escapeHtml((complementary||[]).length ));
			_out.push("\n\t\t</h1>\n\t\t<b onclick=\"showModal()\" class=\"clickable\">complementares</b>\n\t</button>\n</div>\n<div class=\"col-sm-6\">\n\t<button onclick=\"showModal('simple')\" class=\"btn btn-default btn-block\" style=\"text-align:center;padding:20px\">\n\t\t<h1 class=\"laws-counter clickable\">\n\t\t\t");
			_out.push(escapeHtml((simple||[]).length ));
			_out.push("\n\t\t</h1>\n\t\t<b onclick=\"showModal()\" class=\"clickable\">ordinárias</b>\n\t</button>\n</div>\n");
		return _out.join("");
	}
};
