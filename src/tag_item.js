// ##################################################################################### Tag Editor Component

var TagItem = (function(window) {

    var TagItemUI = function() {
        this.createDOMElements();
    };

    TagItemUI.prototype.createDOMElements = function() {
        var wrapper = createElement(blockElement, 'item' + wrapperClassNameSufix);
        var prefixWrapper = createElement(blockElement, 'preffix' + wrapperClassNameSufix);
        var sufixWrapper = createElement(blockElement, 'suffix' + wrapperClassNameSufix);
        var labelWrapper = createElement(blockElement, 'label' + wrapperClassNameSufix);
        var label = createElement(textElement, 'label');

        append(wrapper, prefixWrapper);
        append(wrapper, labelWrapper);
        append(labelWrapper, label);
        append(wrapper, sufixWrapper);
        this.label = label;
        this.wrapper = wrapper;
        this.labelWrapper = labelWrapper;
        this.sufixWrapper = sufixWrapper;
        this.prefixWrapper = prefixWrapper;
    };

    var TagItem = function(value, options) {
        this.options = copy({}, TagItem.defaults, options);
        this.ui = new TagItemUI();
        this.init();
        this.setValue(value);
    };

    TagItem.defaults = {

    };

    TagItem.prototype.init = function() {
        this.ui.createDOMElements();
        this.attachEventListeners();
    };

    TagItem.prototype.attachEventListeners = function() {
        this.ui.label.onclick = delegate(this.onClick, this);
    };

    TagItem.prototype.onClick = function(event) {
        if (this.options.labelClickCallback) {
            this.options.labelClickCallback(this);
        }
        log('item requested an edit');
        stopEventPropagation(event);
        return false;
    };

    TagItem.prototype.valueChange = function(changed, oldValue) {
        // simulate how a suggestion would look like

        // TODO : trigger value change callbacks
        //console.log('tag label changed' + this.value);
    };

    TagItem.prototype.setValue = function(value) {
        // TODO : provide enable/disable option for this value change check
        var changed = value !== this.value;
        var oldValue = this.value;
        if (changed) {
            this.value = value;
            var label = this.label(value);
            this.ui.label.innerHTML = label;
            this.ui.label.title = label;
        }
        this.valueChange(changed, oldValue);
    };

    TagItem.prototype.getValue = function() {
        return this.value;
    };

    TagItem.prototype.setSelected = function(selected) {
        this.selected = selected;
        if (selected) {
            addClass(this.ui.wrapper, 'selected');
        } else {
            removeClass(this.ui.wrapper, 'selected');
        }
    };

    TagItem.prototype.destroy = function() {
        if (this.ui.wrapper.parentNode && typeof this.ui.wrapper.parentNode.removeChild !== 'undefined')
            this.ui.wrapper.parentNode.removeChild(this.ui.wrapper);

    };

    TagItem.prototype.label = function() {

        // TODO : add a decorator callback here exposed from options
        return '' + this.value;
    };

    return TagItem;
})(window);
