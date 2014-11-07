describe("InViewport", function() {

    afterEach(function(){
      InViewport.clear();
    });

    it("should be an object", function() {
        expect(typeof InViewport).toBe('object');
    });

    it("should have a track function", function() {
        expect(typeof InViewport.track).toBe('function');
    });

    it('should store a list of elements', function() {
        expect(InViewport.elements.length).toBe(0);
        InViewport.track($('<div></div>'));
        expect(InViewport.elements.length).toBe(1);
    });

    it('should have a clear function to tracking elements', function() {
        InViewport.track($('<div></div>'));
        expect(InViewport.elements.length).toBe(1);
        InViewport.clear();
        expect(InViewport.elements.length).toBe(0);
    });

    it('should take an jquery object to track', function() {
        InViewport.track($('<div></div>'));
        expect(InViewport.elements.length).toBe(1);
        expect(InViewport.elements[0].el).toBeDefined();
    });

    it('should take an js object to track', function() {
        InViewport.track(document.createElement('div'));
        expect(InViewport.elements.length).toBe(1);
        expect(InViewport.elements[0].el).toBeDefined();
    });

});
