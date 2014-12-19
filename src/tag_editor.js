// ##################################################################################### Tag Editor Component


var TagEditorInput = function(wrapper){
    
    this.init(el);
};


TagEditorInput.prototype.attachEventListeners = function() {
    var input = this.ui.input;
    addEventListener(input, 'keyup', around(this, this.onKeyUpEvents));
    addEventListener(input, 'keypress', around(this, this.onKeyPressEvents));
    addEventListener(input, 'focus', around(this, this.onFocusEvent));
    addEventListener(input, 'blur', around(this, this.onBlurEvent));
};

var TagEditor = function(el, options) {

    this.options = copy({}, TagEditor.defaults, options);
    this.selectedIdx = -1;
    this.tags = [];
    this.init(el);

};

TagEditor.defaults = {
   
};

TagEditor.prototype.init = function(el) {

    this.ui = new TagEditorUI(el);
    this.attachEventListeners();

};

// model

// selection

TagEditor.prototype.getSelectedIdx = function() {
    return this.getIndexBoundsValue(this.selectedIdx);
};

TagEditor.prototype.findPreviousTag = function() {
    // woohoo js doesn't complain of index out of bounds '
    return this.tags[this.getSelectedIdx() - 1];
};

TagEditor.prototype.setCurrentTag = function(idx) {
    this.setSelectedIdx(idx);
    var size = this.tags.length;
    for (var i = 0; i < size; i++) {
        if (i !== idx) {
            this.tags[i].setSelected(false);
        }
    }
    var selectedTagElement = this.getCurrentTag();
    if (selectedTagElement) {
        selectedTagElement.setSelected(true);
    }
};

TagEditor.prototype.onTagClickEvent = function(tag) {
    this.setCurrentTagEl(tag);
    this.syncInputWidthTag(tag);
};
TagEditor.prototype.syncInputWidthTag = function(tag) {
    var _tag = tag || this.getCurrentTag();
    this.ui.input.value = _tag.getValue() || '';
    this.sizeInput(_tag);
    this.positionInput(_tag);
    this.ui.input.focus();
};

TagEditor.prototype.isIndexOutOfBound = function() {
    return this.getIndexBoundsValue(this.getSelectedIdx()) !== this.getSelectedIdx();
};

TagEditor.prototype.getIndexBoundsValue = function(idx) {
    var size = this.tags.length;
    return idx < 0 ? 0 : idx > size ? size - 1 : idx;
};

TagEditor.prototype.setCurrentTagEl = function(tag) {
    var idx = ( typeof tag === "number") ? tag : -1;
    var instance = tag;
    var size = this.tags.length;
    for (var i = 0; i < size; i++) {
        if (this.tags[i] === tag || idx === i) {
            this.setCurrentTag(i);
            break;
        }
    }
};

TagEditor.prototype.getCurrentTag = function() {
    return this.tags[this.getSelectedIdx()];
};

TagEditor.prototype.isSubmitKey = function(code) {
    // TODO provide options to set this keys
    // TODO separate this logic
    // TODO Handle exceptions like shortcuts
    // TODO Use constants and not magic numbers
    // comma or enter
    return code === 13 || code === 188;
};

TagEditor.prototype.removeCurrent = function() {
    var tag = this.getCurrentTag();
    tag.destroy();
    this.tags.splice(this.getSelectedIdx(), 1);
    this.setCurrentTag(this.getSelectedIdx() - 1);
};

TagEditor.prototype.insertTagAfter = function(tag, idx) {
    var ui = tag.ui;
    var tagsWrapper = this.ui.tags;
    var size = tagsWrapper.childNodes.length;
    var tagElements = tagsWrapper.childNodes;
    var idxResult = -1;
    if (idx >= size - 1) {
        tagsWrapper.appendChild(ui.wrapper);
        this.tags.push(tag);
        idxResult = size;
    } else if (idx < 0) {
        if (tagsWrapper.firstChild) {
            tagsWrapper.insertBefore(ui.wrapper, tagsWrapper.firstChild);
        } else {
            tagsWrapper.appendChild(ui.wrapper);
        }
        this.tags.unshift(tag);
        idxResult = 0;
    } else {
        tagsWrapper.insertBefore(ui.wrapper, tagElements[idx + 1]);
        this.tags.splice(idx + 1, 0, tag);
        result = idx + 1;
    }
    return idxResult;

};

TagEditor.prototype.createNextTag = function(nextTo) {
    var tag = this.createTagItem();
    if (nextTo) {
        // TODO Treat left to right text.
        this.insertTagAfter(tag, this.getSelectedIdx());
        this.setCurrentTag(this.getSelectedIdx() + 1);
    } else {
        var idx = this.appendTag(tag);
        this.setCurrentTag(idx);
    }
    this.positionInput();

};

TagEditor.prototype.selectPrev = function() {
    this.selectNth(this.getSelectedIdx() - 1);
};

TagEditor.prototype.selectNext = function() {
    this.selectNth(this.getSelectedIdx() + 1);
};

TagEditor.prototype.selectNth = function(index) {
    var idx = this.getIndexBoundsValue(index);
    this.finishEditingTag();
    this.setCurrentTag(idx);
    this.syncInputWidthTag();
};

TagEditor.prototype.handleSpecialInputKeyPress = function(event) {

    var result = {
        regularKey : true,
        preventEvent : false
    };

    var code = event.keyCode || event.which;
    log(code);
    // tab
    var tab = code === 9;
    if (tab) {

        if (event.shiftKey) {
            var firstSelected = (this.getSelectedIdx() === 0);
            if (!firstSelected) {
                this.selectPrev();
                //event.preventDefault();
                //this.inputEl.focus();
            }
        } else {
            var lastSelected = (this.getSelectedIdx() === this.tags.length - 1);
            if (!lastSelected) {
                this.selectNext();
                //event.preventDefault();
            }
        }
        result.regularKey = false;
    } else if (code === 39) {
        //right
        var caret = CaretAPI.getCaretPosition(this.ui.input);
        var gotoNext = caret.end === this.ui.input.value.length;
        if (gotoNext) {
            this.selectNext();
            //event.preventDefault();
            CaretAPI.setCaretPosition(this.ui.input, 0);

        }
    } else if (code == 37) {
        //left
        var caret = CaretAPI.getCaretPosition(this.ui.input);
        var gotoPrev = caret.start === 0;
        if (gotoPrev) {
            this.selectPrev();
            //event.preventDefault();
            CaretAPI.setCaretPosition(this.ui.input, this.ui.input.value.length * 2);
        }
    }
    return result;
};

TagEditor.prototype.handleSpecialInputKeyUp = function(event) {

    var result = {
        regularKey : true,
        preventEvent : false
    };

    var code = event.keyCode || event.which;
    log(code);
    if (this.isSubmitKey(code)) {
        var comma = code === 188;
        var discarded = this.finishEditingTag(comma);
        if (discarded && comma) {
            this.syncInputWidthTag();
        } else {
            this.createNextTag(comma);
            result.preventEvent = true;
        }
        result.regularKey = false;
    } else if (code === 9) {
        result.regularKey = false;
    }

    return result;
};

TagEditor.prototype.finishEditingTag = function() {
    var discarded = true;
    var value = this.ui.input.value;
    if (trim(value).length > 0 && trim(value) !== ',') {
        var discarded = false;
    } else {
        this.removeCurrent();
    }
    this.ui.input.value = '';
    log("finishEditingTag");
    return discarded;
};

TagEditor.prototype.setSelectedIdx = function(idx) {
    // position outside the viewport
    this.selectedIdx = this.getIndexBoundsValue(idx);
};

TagEditor.prototype.createTagItem = function(value) {
    return new TagItem(value, {
        labelClickCallback : around(this, this.onTagClickEvent)
    });
};

TagEditor.prototype.appendTag = function(tag) {
    return this.insertTagAfter(tag, this.tags.length);
};

TagEditor.prototype.positionInput = function(tag) {
    var _tag = tag || this.getCurrentTag();
    if (_tag) {
        var pos = {
            top : _tag.ui.wrapper.offsetTop,
            left : _tag.ui.wrapper.offsetLeft
        };
        addClass(this.ui.wrapper, 'editing');
        this.ui.editWrapper.style.top = (pos.top - 1) + "px";
        this.ui.editWrapper.style.left = (pos.left + 1) + "px";
        this.ui.editWrapper.style.display = 'block';
    } else {
        this.moveInputOut();
    }
};

TagEditor.prototype.moveInputOut = function() {
    // position outside the viewport
    removeClass(this.ui.wrapper, 'editing');
    this.ui.editWrapper.style.display = 'none';
};

TagEditor.prototype.syncInput = function() {
    var value = this.ui.input.value;
    this.setCurrentTagValue(value);
    this.sizeInput();
    this.positionInput();
    return false;
};

TagEditor.prototype.onWrapperClick = function(event) {

    log('wrapper click');
    if (!this.tags.length) {
        this.createNextTag(false);
    }
    this.syncInputWidthTag();

    this.ui.input.focus();
    var that = this;
};

TagEditor.prototype.sizeInput = function(tag) {
    var _tag = tag || this.getCurrentTag();
    var width = 0;
    if (_tag) {
        width = _tag.ui.label.offsetWidth + 10;
    }
    this.ui.input.style.width = width + 'px';
};

TagEditor.prototype.setCurrentTagValue = function(value) {
    this.getCurrentTag().setValue(value);
};

// ################################################### events

TagEditor.prototype.attachEventListeners = function() {
    var wrapper = this.ui.wrapper;
    var input = this.ui.input;
    var that = this;
    addEventListener(wrapper, 'click', around(this, this.onWrapperClick));
    addEventListener(input, 'keyup', around(this, this.onKeyUpEvents));
    addEventListener(input, 'keypress', around(this, this.onKeyPressEvents));
    addEventListener(input, 'focus', around(this, this.onFocusEvent));
    addEventListener(input, 'blur', around(this, this.onBlurEvent));
};

TagEditor.prototype.onBlurEvent = function(event) {
    log('blur event triggered', event);
    this.finishEditingTag();
    this.moveInputOut();
    stopEventPropagation(event);
};

TagEditor.prototype.onKeyPressEvents = function(event) {
    log('key press event triggered', event);
    if (this.tags.length === 0) {
        return false;
    }
    var specialKeysResult = this.handleSpecialInputKeyPress(event);
    if (specialKeysResult.regularKey) {
        this.syncInput();
    }
    if (specialKeysResult.preventEvent && event.preventDefault) {
        event.preventDefault();
    }
    return !specialKeysResult.preventEvent;
};

TagEditor.prototype.onKeyUpEvents = function(event) {
    log('key up event triggered', event);
    if (this.tags.length === 0) {
        return false;
    }
    var specialKeysResult = this.handleSpecialInputKeyUp(event);
    if (specialKeysResult.regularKey) {
        this.syncInput();
    }

    if (specialKeysResult.preventEvent && event.preventDefault) {
        event.preventDefault();
    }
    return !specialKeysResult.preventEvent;

};

TagEditor.prototype.onFocusEvent = function(event) {
    log('focus event triggered', event);
    if (this.isIndexOutOfBound() || this.tags.length === 0) {
        this.createNextTag(false);
    }
    this.syncInputWidthTag();
};
