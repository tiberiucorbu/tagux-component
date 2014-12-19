(function(w){

    var input = document.getElementById('tag-editor-input');

    var firstTagEditorInstance = new TagEditor(input);

    var element = document.getElementById('tag-editor-block');

    var secondTagEditorInstance = new TagEditor(element);
    
    document.getElementById('clear-console').onclick = function(event){ document.getElementById('debug').innerHTML='';};

})(window);
