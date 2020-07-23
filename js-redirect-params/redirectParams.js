var redirectParams = function () {
            
    var parser = document.createElement('a');
    parser.href = window.location.href;

    // get params string
//    var query = parser.search.substring(1);
    const urlParams = new URLSearchParams(parser.search);
    
    if (urlParams) {

        var ingoring = [
          "mailto:",
          "google"
        ];


        Array.prototype.forEach.call(document.querySelectorAll("a"), function(ref){
            // get current href value
            var old = ref.href;
            const oldParams = new URLSearchParams(ref.search);

            console.log("HOST url: " + old);
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
                        
            for (const key of urlParams.keys()) {
                
                console.log("KEY: " + key);                
                var ignoreParam = false;
                
                // ignore param if exist
                for (const key0 of oldParams.keys()) {
                    
                    console.log("KEY OLD: " + key0);                    
                    if (key0 == key) {                        
                        console.log("IGNORE");
                        ignoreParam = true;
                        break;
                    }
                }
                
                if (!ignoreParam) {
                    
                    // we can have 3 types of queries:
                    // 1. http://localhost?    - add "params"
                    // 2. http://localhost?a=1 - add "& params"
                    // 3. http://localhost     - add "? params"
                    if (ref.href.includes("?")) {
                        if (ref.href.endsWith("?")) {
                            ref.href += key + "=" + urlParams.get(key);
                        } else {
                            ref.href += "&" + key + "=" + urlParams.get(key);
                        }
                    } else {
                        ref.href += "?" + key + "=" + urlParams.get(key);
                    }
            
                }                
            }

            // @REMOVE IF NEED
            console.log("NEW url: " + ref.href);
        });
    }
};