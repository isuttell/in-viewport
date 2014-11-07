/**
 * In Viewport
 * -----------------------------------------------------------------------------
 * Checks to see if an element is visible and provides events for when it
 * leaves or enters
*/

(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && typeof define.amd === 'object') {
    define(['exports'], function(exports) {
      return factory(root, exports);
    });
  } else {
    root.InViewport = factory(root, {});
  }
})(this, function(root, InViewport) {
  'use strict';

  // Bind Poly Fill
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1);
      var fToBind = this;
      var FNOP = function() {};
      var fBound = function() {
        return fToBind.apply(this instanceof FNOP && oThis ? this : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };

      FNOP.prototype = this.prototype;
      fBound.prototype = new FNOP();

      return fBound;
    };
  }

  /**
   * An array of Elements to track
   *
   * @type {Array}
   */
  InViewport.elements = [];

  /**
   * Creates an Element and tracks its visibility
   *
   * @param {object}  el      Javascript element
   * @param {objects} options optional options see defaults for specifics
   *
   * @returns {Object} Element
   */
  InViewport.track = function(el, options) {
    var element = new Element(el, options);
    this.elements.push(element);
    return element;

  };

  /**
   * Stop tracking everything
   */
  InViewport.clear = function() {
    this.elements = [];
  };

  /**
   * Scroll Throttle time in ms
   *
   * @type {Number}
   */
  InViewport.throttle = 100;

  /**
   * Only run scroll event when we're not waiting
   *
   * @type {Boolean}
   */
  var _waiting = false;

  /**
   * Add Scroll Listenering
   */
  window.addEventListener('scroll', throttleScroll.bind(InViewport), false);

  /**
   * Throttle Function
   */
  function throttleScroll() {
    /*jshint validthis:true */
    if (false === _waiting) {
      _waiting = true;
      setTimeout(scrollEvent.bind(this), InViewport.throttle);
    }
  }

  /**
   * Triggered after throttling has passed
   */
  function scrollEvent() {
    /*jshint validthis:true */
    _waiting = false;
    for (var i = 0; i < this.elements.length; i++) {
      // Update each element
      this.elements[i].update.apply(this.elements[i]);
    }
  }

  /**
   * Element Constructor
   *
   * @param {Object} el      JS element or jQuery element
   * @param {Object} options (optional)
   */
  function Element(el, options) {

    if (typeof window.$ !== 'undefined' && el instanceof window.$) {
      this.$el = el;
      this.el = el[0];
    } else {
      this.el = el;
    }

    this.options = extend(options || {}, defaults);

    // Set the initial status
    this.update();
  }

  /**
   * Is the Element visible in the viewport?
   *
   * @type {Boolean}
   */
  Element.prototype.visible = null;

  /**
   * Updates an elements visible status
   */
  Element.prototype.update = function() {
    this._lastVisible = this.visible;

    // Check
    this.visible = inInViewport(this.el, this.options.viewportFactor);

    // Call callbacks
    if (this._lastVisible !== this.visible && true === this.visible) {
      this.options.onEnter.call(this, this.el);
    } else if (this._lastVisible !== this.visible && false === this.visible) {
      this.options.onLeave.call(this, this.el);
    }
  };

  /**
   * Default Options for Element
   *
   * viewportFactor     How visible should the element be before
   *                    we return true
   *
   * @type {Object}
   */
  var defaults = {
    viewportFactor: 0.2,
    onEnter: function() {},
    onLeave: function() {}
  };

  /**
   * Grab the viewports height so we have a range to check against
   * @return {number}
   */
  function getInViewportHeight() {
    var client = window.document.documentElement.clientHeight;
    var inner = window.innerHeight;

    if (client < inner) {
      return inner;
    } else {
      return client;
    }
  }

  /**
   * Determine where absolutely the element is on the page
   * @return {object}   returns both top and left positions
   */
  function getOffset(el) {
    var offsetTop = 0;
    var offsetLeft = 0;

    do {
      if (!isNaN(el.offsetTop)) {
        offsetTop += el.offsetTop;
      }
      if (!isNaN(el.offsetLeft)) {
        offsetLeft += el.offsetLeft;
      }
      el = el.offsetParent;
    } while (el);

    return {
      top: offsetTop,
      left: offsetLeft
    };
  }

  /**
   * The meat and bones. Determine if the element is visible or not
   *
   * @return {boolean}
   */
  function inInViewport(el, viewportFactor) {
    var elH = el.offsetHeight;
    var scrolled = window.pageYOffset || window.document.documentElement.scrollTop;
    var viewed = scrolled + getInViewportHeight();
    var elTop = getOffset(el).top;
    var elBottom = elTop + elH;

    // if 0, the element is considered in the viewport as soon as it enters.
    // if 1, the element is considered in the viewport only when it's fully inside
    // value in percentage (1 >= viewportFactor >= 0)
    viewportFactor = viewportFactor || 0;

    var top = (elTop + elH * viewportFactor) <= viewed;
    var bottom = elBottom >= scrolled;

    return top && bottom;
  }

  /**
   * Basic Recursive Extend Function
   *
   * @param     {Object}    src     input
   * @param     {Object}    dest    defaults
   *
   * @return    {Object}
   */
  function extend(src, dest) {
    for (var i in dest) {
      if (typeof dest[i] === 'object') {
        src[i] = extend(src[i] || {}, dest[i]);
      } else if (typeof src[i] === 'undefined') {
        src[i] = dest[i];
      }
    }
    return src;
  }

  return InViewport;
});
