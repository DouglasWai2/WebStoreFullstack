import {
  require_react
} from "./chunk-FQO5W7GE.js";
import {
  __commonJS
} from "./chunk-ZS7NZCD4.js";

// node_modules/topbar/topbar.js
var require_topbar = __commonJS({
  "node_modules/topbar/topbar.js"(exports, module) {
    (function(window2, document2) {
      "use strict";
      (function() {
        var lastTime = 0;
        var vendors = ["ms", "moz", "webkit", "o"];
        for (var x = 0; x < vendors.length && !window2.requestAnimationFrame; ++x) {
          window2.requestAnimationFrame = window2[vendors[x] + "RequestAnimationFrame"];
          window2.cancelAnimationFrame = window2[vendors[x] + "CancelAnimationFrame"] || window2[vendors[x] + "CancelRequestAnimationFrame"];
        }
        if (!window2.requestAnimationFrame)
          window2.requestAnimationFrame = function(callback, element) {
            var currTime = (/* @__PURE__ */ new Date()).getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window2.setTimeout(
              function() {
                callback(currTime + timeToCall);
              },
              timeToCall
            );
            lastTime = currTime + timeToCall;
            return id;
          };
        if (!window2.cancelAnimationFrame)
          window2.cancelAnimationFrame = function(id) {
            clearTimeout(id);
          };
      })();
      var canvas, progressTimerId, fadeTimerId, currentProgress, showing, addEvent = function(elem, type, handler) {
        if (elem.addEventListener)
          elem.addEventListener(type, handler, false);
        else if (elem.attachEvent)
          elem.attachEvent("on" + type, handler);
        else
          elem["on" + type] = handler;
      }, options = {
        autoRun: true,
        barThickness: 3,
        barColors: {
          "0": "rgba(26,  188, 156, .9)",
          ".25": "rgba(52,  152, 219, .9)",
          ".50": "rgba(241, 196, 15,  .9)",
          ".75": "rgba(230, 126, 34,  .9)",
          "1.0": "rgba(211, 84,  0,   .9)"
        },
        shadowBlur: 10,
        shadowColor: "rgba(0,   0,   0,   .6)",
        className: null
      }, repaint = function() {
        canvas.width = window2.innerWidth;
        canvas.height = options.barThickness * 5;
        var ctx = canvas.getContext("2d");
        ctx.shadowBlur = options.shadowBlur;
        ctx.shadowColor = options.shadowColor;
        var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        for (var stop in options.barColors)
          lineGradient.addColorStop(stop, options.barColors[stop]);
        ctx.lineWidth = options.barThickness;
        ctx.beginPath();
        ctx.moveTo(0, options.barThickness / 2);
        ctx.lineTo(Math.ceil(currentProgress * canvas.width), options.barThickness / 2);
        ctx.strokeStyle = lineGradient;
        ctx.stroke();
      }, createCanvas = function() {
        canvas = document2.createElement("canvas");
        var style = canvas.style;
        style.position = "fixed";
        style.top = style.left = style.right = style.margin = style.padding = 0;
        style.zIndex = 100001;
        style.display = "none";
        if (options.className)
          canvas.classList.add(options.className);
        document2.body.appendChild(canvas);
        addEvent(window2, "resize", repaint);
      }, topbar = {
        config: function(opts) {
          for (var key in opts)
            if (options.hasOwnProperty(key))
              options[key] = opts[key];
        },
        show: function() {
          if (showing)
            return;
          showing = true;
          if (fadeTimerId !== null)
            window2.cancelAnimationFrame(fadeTimerId);
          if (!canvas)
            createCanvas();
          canvas.style.opacity = 1;
          canvas.style.display = "block";
          topbar.progress(0);
          if (options.autoRun) {
            (function loop() {
              progressTimerId = window2.requestAnimationFrame(loop);
              topbar.progress("+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2));
            })();
          }
        },
        progress: function(to) {
          if (typeof to === "undefined")
            return currentProgress;
          if (typeof to === "string") {
            to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
          }
          currentProgress = to > 1 ? 1 : to;
          repaint();
          return currentProgress;
        },
        hide: function() {
          if (!showing)
            return;
          showing = false;
          if (progressTimerId != null) {
            window2.cancelAnimationFrame(progressTimerId);
            progressTimerId = null;
          }
          (function loop() {
            if (topbar.progress("+.1") >= 1) {
              canvas.style.opacity -= 0.05;
              if (canvas.style.opacity <= 0.05) {
                canvas.style.display = "none";
                fadeTimerId = null;
                return;
              }
            }
            fadeTimerId = window2.requestAnimationFrame(loop);
          })();
        }
      };
      if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = topbar;
      } else if (typeof define === "function" && define.amd) {
        define(function() {
          return topbar;
        });
      } else {
        this.topbar = topbar;
      }
    }).call(exports, window, document);
  }
});

// node_modules/react-topbar-progress-indicator/src/index.js
var require_src = __commonJS({
  "node_modules/react-topbar-progress-indicator/src/index.js"(exports, module) {
    var React = require_react();
    var topbar = typeof window === "undefined" ? {
      show: function() {
      },
      hide: function() {
      },
      config: function() {
      }
    } : require_topbar();
    var semaphore = 0;
    var getTopBar = function(props) {
      return props.topbar || topbar;
    };
    function TopBar(props) {
      React.useEffect(function() {
        if (semaphore === 0) {
          getTopBar(props).show();
        }
        semaphore++;
        return function() {
          semaphore--;
          if (semaphore === 0) {
            getTopBar(props).hide();
          }
        };
      }, []);
      return null;
    }
    TopBar.config = topbar.config;
    module.exports = TopBar;
  }
});
export default require_src();
/*! Bundled license information:

topbar/topbar.js:
  (*! topbar 0.1.4, 2020-04-27
   *  http://buunguyen.github.io/topbar
   *  Copyright (c) 2019 Buu Nguyen
   *  Licensed under the MIT License *)
*/
//# sourceMappingURL=react-topbar-progress-indicator.js.map
