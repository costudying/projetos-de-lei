
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
		_out.push("<div class=\"col-md-6\">\n\t<ul>\n\t\t<li><b>Partido:</b> ");
			_out.push(escapeHtml( party ));
			_out.push("</li>\n\t\t<li><b>Email:</b> ");
			_out.push(escapeHtml( email ));
			_out.push("</li>\n\t\t<li><b>Telefone:</b> ");
			_out.push(escapeHtml( phone ));
			_out.push("</li>\n\t</ul>\n</div>\n");
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
		_out.push("<div class=\"col-sm-6\">\n\t<div class=\"panel panel-default\" style=\"text-align:center;padding:20px\">\n\t\t<h1 onclick=\"showModal('Leis Orgânicas','louco')\"     class=\"laws-counter\">\n\t\t\t");
			_out.push(escapeHtml(organic.length ));
			_out.push("\n\t\t</h1>\n\t\t<b onclick=\"showModal('Leis Orgânicas','louco')\">orgânicas</b>\n\t</div>\n</div>\n<div class=\"col-sm-6\">\n\t<div class=\"panel panel-default\" style=\"text-align:center;padding:20px\">\n\t\t<h1 onclick=\"showModal('Leis Orgânicas','louco')\"     class=\"laws-counter\">\n\t\t\t");
			_out.push(escapeHtml(complementary.length ));
			_out.push("\n\t\t</h1>\n\t\t<b onclick=\"showModal('Leis Orgânicas','louco')\">complementares</b>\n\t</div>\n</div>\n<div class=\"col-sm-6\">\n\t<div class=\"panel panel-default\" style=\"text-align:center;padding:20px\">\n\t\t<h1 onclick=\"showModal('Leis Orgânicas','louco')\"     class=\"laws-counter\">\n\t\t\t");
			_out.push(escapeHtml(simple.length ));
			_out.push("\n\t\t</h1>\n\t\t<b onclick=\"showModal('Leis Orgânicas','louco')\">ordinárias</b>\n\t</div>\n</div>\n");
		return _out.join("");
	}
};
