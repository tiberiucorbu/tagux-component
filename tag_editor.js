var TagEditor = function(options) {
    this.options = $.extend({}, TagEditor.defaults, options);
    this.currentTag = -1;
    this.tags = [];
    this.init();
};

TagEditor.defaults = {
    wrapperElementSelector : '.tag-editor',
    tagItemOptions : {
        labelClickCallback : null
    }
};

TagEditor.prototype.init = function() {
    this.createInstanceOptions();
    this.wrapperEl = $(this.options.wrapperEl);
    this.inputEl = this.wrapperEl.find('input.tag-editor-input').eq(0);
    this.inputWrapper = this.wrapperEl.find('div.tag-editor-wrapper').eq(0);
    this.tagsWrapper = this.wrapperEl.find('div.tags').eq(0);
    this.attachEventListeners();
};

TagEditor.prototype.setCurrentTag = function(currentTag) {
    this.currentTag = currentTag;
    $('.debug').text('current tag ids is ' + this.currentTag);
    var size = this.tags.length;
    for (var i = 0; i < size; i++) {
        if (i !== currentTag) {
            this.tags[i].setSelected(false);
        }
    }
    var currentTagElement = this.getCurrentTag();
    if (currentTagElement) {
        currentTagElement.setSelected(true);
    }
};
TagEditor.prototype.createInstanceOptions = function() {
    var tagItemOptions = this.options.tagItemOptions || {};
    if (tagItemOptions) {
        tagItemOptions.labelClickCallback = $.proxy(this.onTagClickEvent, this);
    }
    this.options.tagItemOptions = tagItemOptions;
};

TagEditor.prototype.onTagClickEvent = function(tag) {
    this.setCurrentTagEl(tag);
    this.syncInputWidthTag();
};
TagEditor.prototype.syncInputWidthTag = function() {
    var tag = this.getCurrentTag();
    this.inputEl.val(tag.getValue());
    this.sizeInput();
    this.positionInput();
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

TagEditor.prototype.findPreviousTag = function() {
    // woohoo js doesn't complain of index out of bounds '
    return this.tags[this.currentTag - 1];
};
TagEditor.prototype.getCurrentTag = function() {
    return this.tags[this.currentTag];
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
    this.tags.splice(this.currentTag, 1);
    this.setCurrentTag(this.currentTag - 1);
};

TagEditor.prototype.insertTagAfter = function(tag, idx) {
    var lastIndex = this.tagsWrapper.children().size() - 1;
    var tagElements = this.tagsWrapper.children();
    if (idx > lastIndex) {
        this.tagsWrapper.append(tag.$el);
        this.tags.push(tag);
    } else if (idx < 0) {
        this.tagsWrapper.prepend(tag.$el);
        this.tags.unshift(tag);
    } else {
        tag.$el.insertAfter(tagElements.eq(idx));
        this.tags.splice(idx + 1, 0, tag);
    }
};

TagEditor.prototype.createNextTag = function(nextTo) {
    var tag = this.createTagItem();
    if (nextTo) {
        // TODO Treat left to right text.
        this.insertTagAfter(tag, this.currentTag);
        this.setCurrentTag(this.currentTag + 1);
    } else {
        var idx = this.appendTag(tag);
        this.setCurrentTag(idx);
    }
    this.positionInput();

};

TagEditor.prototype.selectPrev = function() {
    this.selectNth(this.currentTag - 1);
};

TagEditor.prototype.selectNext = function() {
    this.selectNth(this.currentTag + 1);
};

TagEditor.prototype.selectNth = function(index) {
    var idx = this.getIndexBoundsValue(index);
    this.finishEditingTag();
    this.setCurrentTag(idx);
    this.syncInputWidthTag();
};

TagEditor.prototype.handleSpecialInputKeyPress = function(event) {
    var result = {
        regularKey : true
    };

    var code = event.which || event.keyCode;
    // tab
    var tab = code === 9;
    if (tab) {

        if (event.shiftKey) {
            var firstSelected = (this.currentTag === 0);
            if (!firstSelected) {
                this.selectPrev();
                event.preventDefault();
                //this.inputEl.focus();
            }
        } else {
            var lastSelected = (this.currentTag === this.tags.length - 1);
            if (!lastSelected) {
                this.selectNext();
                event.preventDefault();
            }
        }
        result.regularKey = false;
    } else if (code === 39) {
        //right
        var caret = CaretAPI.getCaretPosition(this.inputEl[0]);
        var gotoNext = caret.end === this.inputEl.val().length;
        if (gotoNext) {
            
            this.selectNext();
            event.preventDefault();
            CaretAPI.setCaretPosition(this.inputEl[0], 0);
            
        }
    } else if (code == 37) {
        //left
        var caret = CaretAPI.getCaretPosition(this.inputEl[0]);
        var gotoPrev = caret.start === 0;
        if (gotoPrev) {
            this.selectPrev();
            event.preventDefault();
            CaretAPI.setCaretPosition(this.inputEl[0], this.inputEl.val().length*2);
        }
    }
    return result;
};

TagEditor.prototype.handleSpecialInputKeyUp = function(event) {
    var result = {
        regularKey : true
    };

    var code = event.which || event.keyCode;

    if (this.isSubmitKey(code)) {
        var comma = code === 188;
        var discarded = this.finishEditingTag(comma);
        //ultra special case for comma
        if (discarded && comma) {
            var tag = this.findPreviousTag();
            if (tag) {
                this.setCurrentTagEl(tag);
                this.syncInputWidthTag();
            }
        }
        this.createNextTag(comma);
        event.preventDefault();
        result.regularKey = false;
    } else if (code === 9) {
        result.regularKey = false;
    }

    return result;
};

TagEditor.prototype.finishEditingTag = function() {
    var discarded = true;
    var value = this.inputEl.val();
    if ($.trim(value).length > 0 && $.trim(value) !== ',') {
        var discarded = false;
    } else {
        this.removeCurrent();
    }
    this.inputEl.val('');
    return discarded;
};

TagEditor.prototype.positionInput = function() {
    var tag = this.getCurrentTag();
    if (tag) {
        var pos = tag.$el.position();
        this.wrapperEl.addClass('editing');
        this.inputWrapper.css({
            top : (pos.top - 1) + "px",
            left : (pos.left + 24) + "px"
        });
    } else {
        this.moveInputOut();
    }
};

TagEditor.prototype.moveInputOut = function() {
    // position outside the viewport
    this.wrapperEl.removeClass('editing');
    
    this.inputWrapper.css({
        top : '-100px'
    });

};

TagEditor.prototype.createTagItem = function(value) {
    return new TagItem(value, this.options.tagItemOptions);
};

TagEditor.prototype.appendTag = function(tag) {
    var size = this.tags.length;
    this.tagsWrapper.append(tag.$el);
    return this.tags.push(tag) - 1;
};

TagEditor.prototype.isIndexOutOfBound = function() {
    return this.getIndexBoundsValue(this.currentTag) !== this.currentTag;
};

TagEditor.prototype.getIndexBoundsValue = function(idx) {
    var size = this.tags.length;
    return this.currentTag < 0 ? 0 : idx > size ? size - 1 : idx;
};

TagEditor.prototype.onFocusEvent = function(event) {
    if (this.isIndexOutOfBound() || !this.tags.length) {
        this.createNextTag(false);
    }
    this.syncInputWidthTag();
};

TagEditor.prototype.syncInput = function() {
    var value = this.inputEl.val();
    this.setCurrentTagValue(value);
    this.sizeInput();
    this.positionInput();
};

TagEditor.prototype.onKeyPressEvents = function(event) {
    var specialKeysResult = this.handleSpecialInputKeyPress(event);
    if (specialKeysResult.regularKey) {
        this.syncInput();
    }
};

TagEditor.prototype.onKeyUpEvents = function(event) {
    var specialKeysResult = this.handleSpecialInputKeyUp(event);
    if (specialKeysResult.regularKey) {
        this.syncInput();
    }
};

TagEditor.prototype.onBlurEvent = function() {
    this.finishEditingTag();
    this.moveInputOut();

};

TagEditor.prototype.onWrapperClick = function() {
    this.inputEl.focus();
};

TagEditor.prototype.attachEventListeners = function() {
    this.wrapperEl = $(this.options.wrapperEl);
    this.wrapperEl.on('click', $.proxy(this.onWrapperClick, this));
    this.inputEl.on('keyup', $.proxy(this.onKeyUpEvents, this));
    this.inputEl.on('keypress', $.proxy(this.onKeyPressEvents, this));
    this.inputEl.on('focus', $.proxy(this.onFocusEvent, this));
    this.inputEl.on('blur', $.proxy(this.onBlurEvent, this));

};

TagEditor.prototype.sizeInput = function() {
    var currentTag = this.getCurrentTag();
    var width = 0;
    if (currentTag) {
        width = currentTag.$el.find('.label-wrapper').width()+10;

    }
    this.inputEl.width(width);
};

TagEditor.prototype.setCurrentTagValue = function(value) {
    this.getCurrentTag().setValue(value);
};
