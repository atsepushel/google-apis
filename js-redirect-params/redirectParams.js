var redirectParams = function () {
            
    var parser = document.createElement('a');
    parser.href = window.location.href;

    // get params string
    var query = parser.search.substring(1);
    
    var ingoring = [
      "mailto:",
      "google"
    ];


    Array.prototype.forEach.call(document.querySelectorAll("a"), function(ref){
        // get current href value
        var old = ref.href;
        
        console.log("HOST url: " + ref.hostname);
        // check for ignore
        for (var i = 0; i < ingoring.length; i++) {
            
            var v = ref.hostname || old;
            if (v.startsWith(ingoring[i]) ) {
                return;
            }
        }

        // @REMOVE IF NEED
        console.log("OLD url: " + old);

        // clear last / if exist                
        if (old.endsWith("/")) {
            old = old.substring(0, old.length - 1);
        }

        // we can have 3 types of queries:
        // 1. http://localhost?    - add "params"
        // 2. http://localhost?a=1 - add "& params"
        // 3. http://localhost     - add "? params"
        if (old.includes("?")) {
            if (old.endsWith("?")) {
                ref.href = old + query;
            } else {
                ref.href = old + "&" + query;
            }
        } else {
            ref.href = old + "?" + query;
        }

        // @REMOVE IF NEED
        console.log("NEW url: " + ref.href);
    });

    return query;
};