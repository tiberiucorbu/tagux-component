// Define the collection class.

// Polyfil for object create
if ( typeof Object.create != 'function') {
    Object.create = (function() {
        var Object = function() {
        };
        return function(prototype) {
            if (arguments.length > 1) {
                throw Error('Second argument not supported');
            }
            if ( typeof prototype != 'object') {
                throw TypeError('Argument must be an object');
            }
            Object.prototype = prototype;
            var result = new Object();
            Object.prototype = null;
            return result;
        };
    })();
}
window.Collection = (function() {
    var methods = {
        sum : function() {
            var res = 0;
            for (var i = 0; i < this.length; i++) {
                res += this[i];
            }
            return res;
        },
        add : function(item) {
            this.push(item);
        },
        addAll : function() {
            for (var x in arguments) {
                this.push(arguments[x]);
            }
        }
    };

    var decorate = function(instance, decorator) {
        for (var x in decorator) {
            if (decorator.hasOwnProperty(x)) {
                instance[x] = decorator[x];
            }
        }
    };

    var Collection = function(a) {
        var inst = Object.create(Array.prototype);

        var retVal = Array.prototype.constructor.apply(inst, arguments) || inst;
        decorate(retVal, methods);

        return retVal;
    };

    return Collection;

})(window);