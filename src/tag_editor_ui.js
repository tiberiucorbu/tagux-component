var TagEditOverlayUI = (function() {
    var createDomStructure = function(wrapper, input, uiCache) {
        var overlay = createElement('div', 'overlay-layer');
        var editWrapper = createElement('div', 'editor' + wrapperClassNameSufix);
        var input = createElement('input', 'editor-input');
        append(overlay, editWrapper);
        append(editWrapper, input);
        if (wrapper) {
            append(wrapper, overlay);
        }
    };

    var init = function(el) {
        if (el) {
            if (el.tagName.toLowerCase() === 'input') {
                createDomStructure(null, el, this);
            } else {
                createDomStructure(el, null, this);
            }
        }

    };

    var obj = function(domEl) {
        init.call(this, domEl);
    };
    return obj;

})();

var TagEditorUI = (function() {

    var createDomStructure = function(wrapperClass, wrapper, uiCache) {
        var tags = createElement('div', 'tags');
        var clearfix = createElement('div', ' clearfix clearfix');
        var overlay = createElement('div', 'overlay-layer');
        var editWrapper = createElement('div', 'editor' + wrapperClassNameSufix);
        var sugWrapper = createElement('div', 'sugestion' + wrapperClassNameSufix);
        sugWrapper.style.display = 'none';
        var input = createElement('input', 'editor-input');
        if (!wrapper) {
            wrapper = createElement('div', 'editor relative-layer ' + wrapperClass);
        } else {
            wrapper.className += ' ' + classNamePrefix + 'editor relative-layer';
        }
        uiCache.wrapper = wrapper;
        uiCache.tags = tags;
        uiCache.editWrapper = editWrapper;
        uiCache.input = input;
        uiCache.sugWrapper = sugWrapper; 
        
        append(wrapper, tags);
        append(wrapper, clearfix);
        append(overlay, editWrapper);
        append(editWrapper, input);
        append(editWrapper, sugWrapper);
        append(wrapper, overlay);
        


    };

    var decorateFormControll = function(el, uiCache) {
        el.style.display = 'none';
        var classes = el.className;
        createDomStructure(classes, null, uiCache);
        el.parentNode.insertBefore(uiCache.wrapper, el);
    };

    var init = function(el) {
        if (el) {
            if (el.tagName.toLowerCase() === 'input') {
                decorateFormControll(el, this);
            } else {
                createDomStructure(null, el, this);
            }
        }

    };

    var obj = function(domEl) {
        init.call(this, domEl);
    };
    return obj;

})();
