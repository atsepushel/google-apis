var redirectParams = function () {
            
    var parser = document.createElement('a');
    parser.href = window.location.href;

    // get params string
    var query = parser.search.substring(1);

    $("a").each(function() {

        // get current href value
        var old = $(this).attr("href").trim();

        // @REMOVE IF NEED
        console.log("OLD url: " + $(this).attr("href"));

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
                $(this).attr("href", old + query);
            } else {
                $(this).attr("href", old + "&" + query);
            }
        } else {
            $(this).attr("href", old + "?" + query);
        }

        // @REMOVE IF NEED
        console.log("NEW url: " + $(this).attr("href"));
    });

    return query;
};