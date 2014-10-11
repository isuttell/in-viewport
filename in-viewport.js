/*!
|--------------------------------------------------------------------------
| In Viewport
|--------------------------------------------------------------------------
| Checks to see if an element is in the viewport
*/

(function(root, factory){
    "use strict";
    if(typeof define === 'function' && typeof define.amd === 'object') {
        define(['exports'], function(exports){
            root.InViewport = factory(root, exports);
        });
    } else {
        root.InViewport = factory(root, {});
    }
})(this, function(root, InViewport) {
    "use strict";

    // Bind Poly Fill
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
      Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
          // closest thing possible to the ECMAScript 5
          // internal IsCallable function
          throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            FNOP    = function() {},
            fBound  = function() {
              return fToBind.apply(this instanceof FNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        FNOP.prototype = this.prototype;
        fBound.prototype = new FNOP();

        return fBound;
      };
    }

    /**
     * An array of Elements to track
     * @type {Array}
     */
    InViewport.elements = [];

    /**
     * Creates an Element and tracks its visibility
     * @param {object}  el      Javascript element
     * @param {objects} options optional options see defaults for specifics
     *
     * @returns {Object} Element
     */
    InViewport.track = function(el, options)
    {
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
     * Scroll Throttle
     * @type {Number}
     */
    InViewport.throttle = 100;

    /**
     * Only run scroll event when we're not waiting
     * @type {Boolean}
     */
    var waiting = false;

    /**
     * Add Scroll Listenering
     */
    window.addEventListener('scroll', throttleScroll.bind(InViewport), false);

    /**
     * Throttle Function
     */
    function throttleScroll() {
        /*jshint validthis:true */
        if(false === waiting) {
            waiting = true;
            setTimeout(scrollEvent.bind(this), InViewport.throttle);
        }
    }

    /**
     * Triggered after throttling has passed
     */
    function scrollEvent() {
        /*jshint validthis:true */
        waiting = false;
        for(var i = 0; i < this.elements.length; i++) {
            // Update each element
            this.elements[i].update.apply(this.elements[i]);
        }
    }


    /**
     * Element Constructor
     * @param {Object} el      JS element or jQuery element
     * @param {Object} options (optional)
     */
    function Element(el, options) {

        if (typeof $ !== 'undefined' && el instanceof $)
        {
            this.el = el[0];
        }
        else
        {
            this.el = el;
        }

        this.options = extend(options || {}, defaults);

        // Set the initial status
        this.update();
    }

    /**
     * Is the Element visible in the viewport?
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
        if(this._lastVisible !== this.visible && true === this.visible) {
            this.options.onEnter(this.el);
        } else if(this._lastVisible !== this.visible && false === this.visible) {
            this.options.onLeave(this.el);
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
        onEnter: function(){},
        onLeave: function(){}
    };

    /**
     * Grab the viewports height so we have a range to check against
     * @return {number}
     */
    function getInViewportHeight()
    {
        var client = window.document.documentElement.clientHeight,
            inner = window.innerHeight;

        if (client < inner)
        {
            return inner;
        }
        else
        {
            return client;
        }
    }

    /**
     * Determine where absolutely the element is on the page
     * @return {object}   returns both top and left positions
     */
    function getOffset(el)
    {
        var offsetTop = 0,
            offsetLeft = 0;

        do {
            if (!isNaN(el.offsetTop))
            {
                offsetTop += el.offsetTop;
            }
            if (!isNaN(el.offsetLeft))
            {
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
     * @return {boolean}
     */
    function inInViewport(el, viewportFactor)
    {
        var elH = el.offsetHeight,
            scrolled = window.pageYOffset || window.document.documentElement.scrollTop,
            viewed = scrolled + getInViewportHeight(),
            elTop = getOffset(el).top,
            elBottom = elTop + elH;

        // if 0, the element is considered in the viewport as soon as it enters.
        // if 1, the element is considered in the viewport only when it's fully inside
        // value in percentage (1 >= viewportFactor >= 0)
        viewportFactor = viewportFactor || 0;

        var top = (elTop + elH * viewportFactor) <= viewed,
            bottom = elBottom >= scrolled;


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
        for(var i in dest) {
            if(typeof dest[i] === 'object') {
                src[i] = extend(src[i] || {}, dest[i]);
            } else if(typeof src[i] === 'undefined') {
                src[i] = dest[i];
            }
        }
        return src;
    }

    return InViewport;
});