"use strict";

function elmatches(elm, selector) {
	var matches = (elm.document || elm.ownerDocument).querySelectorAll(selector),
	    i = matches.length;
	while (--i >= 0 && matches.item(i) !== elm);
	return i > -1;
}

document.addEventListener("DOMContentLoaded", function () {

	function delegationLinks(target) {
		if (target.getAttribute('href').indexOf('//' + location.host) >= 0) {
			return target.setAttribute('target', '_self');
		} else {
			return target.setAttribute('target', '_blank');
		}
	}

	function delegationVideoPlayerStart(target) {
		var body = target.offsetParent;
		body.innerHTML = body.querySelector('textarea').textContent;
	}

	function handler_links(evt) {
		for (var target = evt.target; target && target != this; target = target.parentNode) {
			if (elmatches(target, 'a:not([target]):not([href^="/"]):not([href^="javascript:"])')) {
				return delegationLinks(target, evt);
				break;
			} else if (elmatches(target, '.videoplayer a.thumbnail')) {
				return delegationVideoPlayerStart(target, evt);
				break;
			}
		}
	}

	['click', 'pointerdown'].forEach(function (e) {
		document.addEventListener(e, handler_links);
	});

	function countdown(el) {
		function convertTimeRemaining(ms) {
			ms = parseInt(ms);
			return {
				'total': ms,
				'days': Math.floor(ms / (1000 * 60 * 60 * 24)),
				'hours': Math.floor(ms / (1000 * 60 * 60) % 24),
				'minutes': Math.floor(ms / 1000 / 60 % 60),
				'seconds': Math.floor(ms / 1000 % 60)
			};
		}
		function ticking(total) {
			if (total > 10 * 1000) {
				var remaining = convertTimeRemaining(total);
				formatRemaining(remaining);
				setTimeout(function () {
					ticking(total - 1000);
				}, 1000);
			} else {
				el.innerHTML = '活动即将开始';

				setTimeout(function () {
					location.reload();
				}, 2 * 60 * 1000);
			}
		}
		function formatRemaining(remaining) {
			var html = '';
			if (remaining.days) html += remaining.days + '<small>天</small>';

			if (remaining.hours) html += remaining.hours + '<small>时</small>';else if (remaining.days) html += '0<small>时</small>';

			html += (remaining.minutes || 0) + '<small>分</small>';
			html += (remaining.seconds || 0) + '<small>秒</small>';

			el.innerHTML = html;
			return html;
		}

		var endTimeString = el.getAttribute('countdown'),
		    endTimeParse = Date.parse(endTimeString);
		if (!endTimeParse || isNaN(endTimeParse)) {
			(function () {
				var parser = function parser(date) {
					var timestamp,
					    struct,
					    minutesOffset = 0;

					if (struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date)) {
						for (var i = 0, k; k = numericKeys[i]; ++i) {
							struct[k] = +struct[k] || 0;
						}

						struct[2] = (+struct[2] || 1) - 1;
						struct[3] = +struct[3] || 1;

						if (struct[8] !== 'Z' && struct[9] !== undefined) {
							minutesOffset = struct[10] * 60 + struct[11];

							if (struct[9] === '+') {
								minutesOffset = 0 - minutesOffset;
							}
						}

						timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
					} else {
						timestamp = Date.parse ? Date.parse(date) : NaN;
					}

					return timestamp;
				};

				var numericKeys = [1, 4, 5, 6, 7, 10, 11];
				;
				endTimeParse = parser(endTimeString);
			})();
		}
		ticking(endTimeParse - Date.parse(new Date()));
	}
	[].forEach.call(document.querySelectorAll('[countdown]'), countdown);
});

"use strict";var KCTip = (function () {
	function t(t, i) {
		if (t == document) return !1;for (var e = (t.document || t.ownerDocument).querySelectorAll(i), o = e.length; --o >= 0 && e.item(o) !== t;);return o > -1;
	}function i(t, i) {
		return t.appendChild(i);
	}function e(t) {
		return document.createElement(t);
	}function o(t, i, e, o) {
		return t.addEventListener(i, e, o);
	}function n(t, i, e, o) {
		return t.removeEventListener(i, e, o);
	}function s(i, e, o) {
		for (var n = i.target; n && n != this; n = n.parentNode) if (t(n, e)) return o(n);
	}function c(t, i) {
		return t.classList.add(i);
	}function p(t, i) {
		return t.classList.remove(i);
	}function r(t, i) {
		return t.classList.contains(i);
	}function a() {
		function t(t) {
			g = !0, k = !0, x = !1;
		}function i(t) {
			g = !1, k = !1, x = !1;
		}var e = document.body;o(e, "touchstart", t), o(e, "touchend", i), o(e, "touchcancel", i), o(e, "pointerover", function (i) {
			"touch" == i.pointerType ? t() : (g = !1, k = !1);
		}), o(e, "mouseover", function (t) {
			k ? (k = !1, g = !0) : (g = !1, x = !0);
		}), o(e, "mouseout", function (t) {
			x = !1;
		});var n = '[href^="http://fleet.diablohu.com/"], [kctip]',
		    c = document.createEvent("Event"),
		    p = document.createEvent("Event");c.initEvent("tipshow", !0, !0), p.initEvent("tiphide", !0, !0), o(e, "mouseover", function (t) {
			g || s(t, n, function (t) {
				y.show(t);
			});
		}), o(e, "mouseout", function (t) {
			s(t, n, function () {
				y.hide();
			});
		}), o(e, "click", function (t) {
			s(t, n, function () {
				y.hide(!0);
			});
		}), o(e, "tipshow", function (t) {
			s(t, n, function (t) {
				y.trigger_by_el(t);
			});
		}), o(e, "tiphide", function (t) {
			s(t, n, function () {
				y.hide();
			});
		});
	}function d(t) {
		var i = t.getBoundingClientRect(),
		    e = window.pageXOffset || document.documentElement.scrollLeft,
		    o = window.pageYOffset || document.documentElement.scrollTop;return { top: i.top + o, left: i.left + e, scrollTop: o, scrollLeft: e };
	}function h(t) {
		f = t.clientX, b = t.clientY, u || requestAnimationFrame(l), u = !0;
	}function l() {
		u = !1;var t = document.documentElement.clientWidth,
		    i = (document.documentElement.clientHeight, window.pageXOffset || document.documentElement.scrollLeft),
		    e = window.pageYOffset || document.documentElement.scrollTop,
		    o = f + 10 + i,
		    n = b - y.h - 5 + e;return o + y.w + 10 > t + i && (o = t + i - y.w - 10), 10 >= n - e && (n = b + 25 + e), y.move(o, n);
	}var u = !1,
	    f = void 0,
	    b = void 0,
	    m = e("style");m.innerHTML = '.kctip{z-index:100;position:absolute;display:none;top:-1000px;left:-1000px;color:#f2f2f2;background:rgba(38,38,38,.9);opacity:0;cursor:default!important;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;-webkit-box-shadow:0 5px 5px rgba(0,0,0,.35);box-shadow:0 5px 5px rgba(0,0,0,.35);max-width:320px;font-family:"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","Microsoft YaHei UI","Microsoft YaHei","Hiragino Sans GB","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",Meiryo,sans-serif}.kctip>.wrapper{display:block;position:relative;z-index:1;border:1px solid #cec6a5;padding:8px 10px}.kctip.mod-blur-backdrop{background:0 0}.kctip.mod-blur-backdrop>.wrapper{background:rgba(38,38,38,.5)}.kctip.show{display:inline-block;will-change:opacity;-webkit-transition:opacity .2s ease-out;transition:opacity .2s ease-out}.kctip.on{opacity:1}.kctip.on.mod-blur-backdrop{-webkit-backdrop-filter:blur(7.5px);backdrop-filter:blur(7.5px)}.kctip:before{position:absolute;width:0;height:0;overflow:hidden;content:"";border:5px solid transparent}.kctip .loading{padding:.25em .75em}.kctip[kctip-indicator-pos=bottom]:before{border-top-color:#cec6a5;left:50%;left:-webkit-calc(50% - 4px);left:calc(50% - 4px);bottom:-10px}.kctip[kctip-indicator-pos=bottom]{-webkit-box-shadow:0 -5px 5px rgba(0,0,0,.35);box-shadow:0 -5px 5px rgba(0,0,0,.35)}.kctip[kctip-indicator-pos=top]:before{border-bottom-color:#cec6a5;left:50%;left:-webkit-calc(50% - 4px);left:calc(50% - 4px);top:-10px}.kctip[kctip-indicator-pos=left]:before{border-right-color:#cec6a5;top:50%;top:-webkit-calc(50% - 4px);top:calc(50% - 4px);left:-10px}.kctip[kctip-indicator-pos=right]:before{border-left-color:#cec6a5;top:50%;top:-webkit-calc(50% - 4px);top:calc(50% - 4px);right:-10px}.kctip[kctip-class=ships]{min-width:320px;width:320px;max-width:none}.kctip[kctip-class=ships]>.wrapper{padding:0 0 0 128px;overflow:hidden;min-height:175px}.kctip[kctip-class=ships] img{display:block;float:left;width:auto;height:auto;border:0;min-width:126px;max-width:126px;margin:1px 1px 1px -127px}.kctip[kctip-class=ships] h3,.kctip[kctip-class=ships] h4{margin:0;overflow:hidden;padding:0 0 0 6px}.kctip[kctip-class=ships] h3{height:34px;line-height:34px;font-size:22px;font-weight:100;background:#cec6a5;color:#594700}.kctip[kctip-class=ships] h3 small{font-size:14px;padding:0 0 0 .5em;vertical-align:middle}.kctip[kctip-class=ships] h4{height:20px;line-height:20px;font-size:12px;font-weight:400;background:#594700;color:#cec6a5;letter-spacing:-.025em}.kctip[kctip-class=ships] h4 i{font-style:normal}.kctip[kctip-class=ships] h4 b{font-weight:400;padding:0 .15em}.kctip[kctip-class=ships] dl{margin:0;line-height:19px;font-size:12px;position:relative;width:100%;padding:3px 8px 0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.kctip[kctip-class=ships] dl dd,.kctip[kctip-class=ships] dl dt{display:block;position:relative;margin:0;padding:0;float:left}.kctip[kctip-class=ships] dl dt{max-width:18%;padding-right:6px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.kctip[kctip-class=ships] dl dd{width:32%;font-size:13px;color:#fff2bf;font-weight:lighter}.kctip[kctip-class=ships] dl dd sup{display:inline-block;font-size:12px;-webkit-transform:scale(.91666667);transform:scale(.91666667);-webkit-transform-origin:0 100%;transform-origin:0 100%;margin:-100% -100% 0 0;padding-left:.3em;opacity:.75;vertical-align:baseline;font-weight:100;top:-.3em;position:relative;line-height:0}.kctip[kctip-class=ships] dl dd:nth-child(4n+2){width:26%}.kctip[kctip-class=ships] dl dd:nth-child(4n+4){width:38%}.kctip[kctip-class=equipments]>.wrapper{padding:0}.kctip[kctip-class=equipments] h3{display:block;position:relative;margin:0;background:#cec6a5}.kctip[kctip-class=equipments] h3>s{display:block;width:36px;height:36px;position:absolute;top:-1px;left:0;background:50% 50% no-repeat}.kctip[kctip-class=equipments] h3>strong{font-size:22px;line-height:22px;display:block;position:relative;padding:6px 10px 6px 42px;color:#594700;font-weight:100}.kctip[kctip-class=equipments] h3>strong small{padding-left:.35em;font-size:smaller}.kctip[kctip-class=equipments] h3>small{height:20px;line-height:20px;font-size:12px;font-weight:400;display:block;background:#594700;color:#cec6a5;letter-spacing:-.025em;padding-left:10px}.kctip[kctip-class=equipments] h3~span{display:block;line-height:19px;font-size:13px;padding-left:10px}.kctip[kctip-class=equipments] h3~span.requirement{padding-left:22px;background:0 50% no-repeat;-webkit-background-size:16px 16px;background-size:16px 16px}.kctip[kctip-class=equipments] h3~span.requirement.is-blueprint{background-image:url(http://fleet.diablohu.com/!/assets/images/blueprint.png)}.kctip[kctip-class=equipments] h3~span.requirement.is-catapult{background-image:url(http://fleet.diablohu.com/!/assets/images/catapult.png)}.kctip[kctip-class=equipments] h3~span:last-child{padding-bottom:6px}.kctip[kctip-class=equipments] h3+span{margin-top:6px}.kctip[kctip-class=equipments] h3+span.requirement{background-position-y:-webkit-calc(50% + 4px);background-position-y:calc(50% + 4px)}', i(document.head, m);var g = !1,
	    k = !1,
	    x = !1,
	    y = { pos: "top", language: "zh_cn", cache: {}, types: ["ships", "equipments"], filters: [], countdown_fade: 250, init: function init() {
			if (this.is_init) return this;this.body = e("div"), c(this.body, "kctip"), this.body.setAttribute("id", "kctip");var t = ["transitionend", "webkitTransitionEnd", "mozTransitionEnd"];t.forEach(function (t) {
				o(this.body, t, function (t) {
					var i = window.getComputedStyle ? getComputedStyle(t.target, null) : t.target.currentStyle;t.currentTarget == t.target && "opacity" == t.propertyName && 0 == i.opacity && y.hideAfter();
				});
			}, this), i(document.body, this.body), this.container = e("div"), c(this.container, "wrapper"), i(this.body, this.container), ("backdrop-filter" in document.documentElement.style || "-webkit-backdrop-filter" in document.documentElement.style) && c(this.body, "mod-blur-backdrop"), this.is_init = !0;
		}, show: function show(t, i, e) {
			return !g && x && t ? (this.el = t || document.body, (i = this.content(i)) ? (clearTimeout(this.timeout_fade), this._pos = e || this.el.getAttribute("kctip-position") || this.pos, this.init(), r(this.body, "show") || c(this.body, "show"), this.update(i), void (this.is_showing = !0)) : !1) : !1;
		}, position: function position(t) {
			this.body.style.top = "", this.body.style.left = "", this.w = this.body.offsetWidth, this.h = this.body.offsetHeight;var i = this["pos_" + (t || this._pos || this.pos)](this.w, this.h);i && this.move(i.x, i.y);
		}, hide: function hide(t) {
			function i() {
				p(y.body, "on"), n(y.el, "mousemove", h), y.el = null, y.is_showing = !1, delete y._pos;
			}return this.is_init && this.is_showing ? void ("mouse" == this._pos ? requestAnimationFrame(i) : this.timeout_fade = setTimeout(i, t ? 0 : this.countdown_fade)) : !1;
		}, hideAfter: function hideAfter() {
			p(this.body, "show"), this.body.style.top = "", this.body.style.left = "", this.body.removeAttribute("kctip-indicator-pos"), this.body.removeAttribute("kctip-indicator-offset-x"), this.body.removeAttribute("kctip-indicator-offset-y"), this.body.removeAttribute("kctip-class"), this.container.innerHTML = "", delete this.curLoading, delete this.t, delete this.w, delete this.h, f = null, b = null;
		}, content: function content(t, i) {
			if (!t) {
				var e = void 0,
				    o = void 0;i = i || this.el, t = i.getAttribute("href");var n = /\/([a-z]+)\/([0-9]+)/gi.exec(t);return n && n.length > 1 && (e = n[1], o = n[2]), e && o && this.types.indexOf(e) >= 0 ? (this.t = e, this.cache[e] || (this.cache[e] = {}), this.cache[e][this.language] || (this.cache[e][this.language] = {}), this.cache[e][this.language][o] ? this.cache[e][this.language][o] : this.load(e, o, this.language)) : null;
			}return t;
		}, update: function update(t, e) {
			return this.t = e || this.t, t.nodeType && 1 == t.nodeType ? i(this.container, t) : this.container.innerHTML = t, this.t ? this.body.setAttribute("kctip-class", this.t) : this.body.removeAttribute("kctip-class"), this.position();
		}, load: function load(t, n, s) {
			this.curLoading = t + "::" + n + "::" + s;var c = e("script");return c.src = "http://fleet.diablohu.com/!/tip/" + t + "/" + s + "/" + n + ".js", o(c, "error", function (t) {
				y.update("发生错误...", "error");
			}), i(document.head, c), this.t = "loading", "载入中...";
		}, loaded: function loaded(t, i, e, o) {
			return this.cache[t] || (this.cache[t] = {}), this.cache[t][this.language] || (this.cache[t][this.language] = {}), this.cache[t][this.language][i] = o, t + "::" + i + "::" + e == this.curLoading ? y.update(o, t) : void 0;
		}, move: function move(t, i) {
			this.body.style.top = i + "px", this.body.style.left = t + "px", c(this.body, "on");
		}, get_indicator_size: function get_indicator_size() {
			return 8;
		}, pos_mouse: function pos_mouse(t, i) {
			this.body.removeAttribute("kctip-indicator-pos"), o(this.el, "mousemove", h);
		}, pos_bottom: function pos_bottom(t, i) {
			var e = d(this.el),
			    o = e.left + (this.el.offsetWidth - this.body.offsetWidth) / 2,
			    n = e.top + this.el.offsetHeight + this.get_indicator_size();return this.body.setAttribute("kctip-indicator-pos", "top"), this.checkpos(o, n, t, i, e);
		}, pos_top: function pos_top(t, i) {
			var e = d(this.el),
			    o = e.left + (this.el.offsetWidth - this.body.offsetWidth) / 2,
			    n = e.top - i - this.get_indicator_size();return this.body.setAttribute("kctip-indicator-pos", "bottom"), this.checkpos(o, n, t, i, e);
		}, pos_left: function pos_left(t, i) {
			var e = d(this.el),
			    o = e.left - t - this.get_indicator_size(),
			    n = e.top + (this.el.offsetHeight - this.body.offsetHeight) / 2;return this.body.setAttribute("kctip-indicator-pos", "right"), this.checkpos(o, n, t, i, e);
		}, pos_right: function pos_right(t, i) {
			var e = d(this.el),
			    o = e.left + this.el.offsetWidth + this.get_indicator_size(),
			    n = e.top + (this.el.offsetHeight - this.body.offsetHeight) / 2;return this.body.setAttribute("kctip-indicator-pos", "left"), this.checkpos(o, n, t, i, e);
		}, checkpos: function checkpos(t, i, e, o, n) {
			n = n || d(this.el);var s = t,
			    c = i,
			    p = { x: s, y: c },
			    r = document.documentElement.clientWidth,
			    a = document.documentElement.clientHeight,
			    h = "undefined" == typeof n.scrollLeft ? window.pageXOffset || document.documentElement.scrollLeft : n.scrollLeft,
			    l = "undefined" == typeof n.scrollTop ? window.pageYOffset || document.documentElement.scrollTop : n.scrollTop;return e = e || this.w, o = o || this.h, t + e > r + h ? p = e > n.left ? { x: r + h - e - 2, y: i } : this.pos_left(e, o) : 0 > t && (p = { x: 10, y: i }), i + o > l + a ? p = this.pos_top(e, o) : l > i && (p = this.pos_bottom(e, o)), this.body.setAttribute("kctip-indicator-offset-x", t - s + "px"), this.body.setAttribute("kctip-indicator-offset-y", i - c + "px"), p;
		}, trigger_by_el: function trigger_by_el(t) {
			this.show(t);
		} };return "loading" !== document.readyState ? a() : o(document, "DOMContentLoaded", function () {
		a();
	}), y;
})();