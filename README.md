# In Viewport

Tracks whether an element is in the viewport. Supports AMD.

## Basic

````
    InViewport.track(document.getElementById('example1'), {
        viewportFactor: 0.2, // What percent to consider in viewport
        // Optionaly called when the element becomes visible
        onEnter: function() {
            // this.el is always available within the enter/leave events
            this.el.style.opacity: 1;
        },
        // Optionaly called when the element isn't visible anymore
        onLeave: function() {
            this.el.style.opacity: 0;
        }
    });
````

## With jQuery

````
    InViewport.track($('#example2'), {
        viewportFactor: 0.2, // What percent to consider in viewport
        onEnter: function() {
            // this.$el is available when using jquery
            this.$el.css('opacity', 1);
        },
        onLeave: function() {
            this.$el.css('opacity', 1);
        }
    });
````


````
    var element = InViewport.track($('#example3'));

    $('#button').click(function(){
        // If the element isn't visible scroll to it
        if(element.visible !== true) {
            $('html, body').animate({
                scrollTop: element.$el.offset().top
            }, 500);
        }
    });
````
