// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.



//https://github.com/toddmotto/lunar
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.lunar = factory();
  }
})(this, function () {

  'use strict';

  function get(el) {
    return el.getAttribute('class');
  }

  function has(elem, name) {
    return new RegExp('(\\s|^)' + name + '(\\s|$)').test(get(elem));
  }

  function add(elem, name) {
    !has(elem, name) && elem.setAttribute('class', (get(elem) && get(elem) + ' ') + name);
  }

  function remove(elem, name) {
    var news = get(elem).replace(new RegExp('(\\s|^)' + name + '(\\s|$)', 'g'), '$2');
    has(elem, name) && elem.setAttribute('class', news);
  }

  function toggle(elem, name) {
    (has(elem, name) ? remove : add)(elem, name);
  }

  return {
    hasClass: has,
    addClass: add,
    removeClass: remove,
    toggleClass: toggle
  };
});