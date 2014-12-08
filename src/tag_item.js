var TagItem = (function(window, $) {
	var TagItem = function(value, options) {
		this.init();
		this.setValue(value);
		this.options = $.extend({}, TagItem.defaults, options);
	};TagItem.defaults = {

	};
	TagItem.prototype.init = function() {
		this.createElements();
		this.attachEventListeners();
	};

	TagItem.prototype.createElements = function() {
		this.$el = $('<div class="tag-item-wrapper"> <div class="tag-preffix-wrapper"><span> preffix</span> </div> <div class="label-wrapper"> <span class="tag-label"></span> </div> <div class="tag-suffix-wrapper"> <span>suffix</span> </div> </div> ');
	};

	TagItem.prototype.attachEventListeners = function() {
		this.$el.find('span.tag-label').on('click', $.proxy(this.onClick, this));
	};

	TagItem.prototype.onClick = function(event) {
		if (this.options.labelClickCallback) {
		    this.options.labelClickCallback(this);
		}
		//console.log('request edit');
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
		    this.$el.find('.tag-label').text(label).attr('title',label);
		}
		this.valueChange(changed, oldValue);
	};

	TagItem.prototype.getValue = function() {
		return this.value;
	};

	TagItem.prototype.setSelected = function(selected) {
		this.selected = selected;
		if (selected) {
		    this.$el.addClass('selected');
		} else {
		    this.$el.removeClass('selected');
		}
	};

	TagItem.prototype.destroy = function() {
		this.$el.off();
		this.$el.remove();
		delete this;
	};

	TagItem.prototype.label = function() {

		// TODO : add a decorator callback here exposed from options
		return '' + this.value;
	};
	
	return TagItem;
})(window, jQuery);
