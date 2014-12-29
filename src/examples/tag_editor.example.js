(function(w) {

    var SugestionsServer = {
        search : function(criteria) {
            var retval = {};
            
            if (criteria && criteria.keyword === 'e') {
                return {
                    results : [{
                        text : 'er'
                    }, {
                        text : 'die'
                    }]
                };
            }
        }
    };

    var input = document.getElementById('tag-editor-input');

    var firstTagEditorInstance = new TagEditor(input, {
        suggestionCallback : function(value, readyCall) {
            
            console.log('sugestion callback called', value.newVal);
            readyCall(SugestionsServer.search({keyword: value.newVal}));
        }
    });

    var element = document.getElementById('tag-editor-block');

    var secondTagEditorInstance = new TagEditor(element);

    document.getElementById('clear-console').onclick = function(event) {
        document.getElementById('debug').innerHTML = '';
    };

})(window);
