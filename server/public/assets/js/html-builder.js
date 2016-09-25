var HTMLBuilder = (function () {
  var builder = {};
  var tags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];
  tags.forEach(function (tag) {
    builder[tag] = function () {
      var content = [];
      var attributes = {};
      for (var i = 0; i < arguments.length; i++) {
        if (_.isArray(arguments[i])) {
          arguments[i].forEach(function (html) {
            content.push(html);
          });
        } else if (_.isObject(arguments[i])) {
          attributes = arguments[i];
        } else {
          content.push(arguments[i]);
        }
      }
      var attrStrings = [];
      for (var attr in attributes) {
        attrStrings.push(attr + '="'+attributes[attr]+'"');
      }
      return '<'+tag+ (attrStrings.length === 0 ? '':(' ' + attrStrings.join(' '))) + '>' + content.join('') + '</' + tag + '>';
    };
  });
  return builder;
}());

/*
function test() {
  var __ = HTMLBuilder;
  var result = __.a({href: 'http://www.google.com'}, __.p('Navigate to ', __.b('Google')));
  var expected = '<a href="http://www.google.com"><p>Navigate to <b>Google</b></p></a>';
  if (result !== expected) {
    console.error(result + ' is not equal to ' + expected);
  } else {
    console.log('OK');
  }

  var result = __.div({id: "rba-main-component"},
                __.ul({class: "rba-feature-list"},
                  __.li("Feature 1"),
                  __.li("Feature 2"),
                  __.li("Feature 3")));
  console.log(result);
};
test();
*/
