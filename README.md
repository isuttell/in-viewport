# In Viewport

Tracks whether an element is in the viewport Supports AMD.


### Basics

````
    var element = InViewport.track(document.getElementById('example') || $('.example'), {
        viewportFactor: 0.2, // What percent to consider in viewport
        onEnter: function($el) {
            // Optionaly called when the element becomes visible
        },
        onLeave: function($el) {
            // Optionaly called when the element isn't visible anymore
        }
    });

    // Shows the current visibility
    console.log(element.visible);
````