// internal constants
var classNamePrefix = 'tag-', wrapperClassNameSufix = '-wrapper', blockElement = 'div', textElement = 'span';
var debug = false;

// some DOMmanip. functions

/**
 * Creates an element and adds a class to it,
 * implemented because this is the case in most of the situations
 * @param tagName the node/element to be created
 * @param className the className of the newly created node ( not processed in any way)
 */

var createElement = function(tagName, className) {
    var result = window.document.createElement(tagName);
    result.className = classNamePrefix + className;
    return result;
};
// short hand - useful for uglyfy process;
var append = function(parent, child) {
    parent.appendChild(child);
};

var classesPatt = /[\s]+/g;

var getElementClasses = function(el) {
    var current = el.className;
    return current.split(classesPatt);

};

var contains = function(container, item) {
    var result = -1;
    for (var x in container) {

        if (container[x] === item) {
            result = x;
            break;
        };
    }
    return result;
};

var addClass = function(el, classToAdd) {
    var classes = getElementClasses(el);
    if (contains(classes, classToAdd) === -1) {
        classes.push(classToAdd);
    }
    el.className = classes.join(' ');
};

var removeClass = function(el, classToAdd) {
    var classes = getElementClasses(el);
    var idx = contains(classes, classToAdd);
    if (idx >= 0) {
        classes.splice(idx, 1);
    }
    el.className = classes.join(' ');
};

function addEventListener(el, eventName, handler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler, false);
    } else {
        el.attachEvent('on' + eventName, handler);
    }
}

function stopEventPropagation(e) {
    log('stoping event propagation');
    if (!e)
        e = window.event;

    //IE9 & Other Browsers
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    //IE8 and Lower
    else {
        e.cancelBubble = true;
    }

}

function triggerEvent(el, eventName) {
    if (document.createEvent) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, false);
        el.dispatchEvent(event);
    } else {
        el.fireEvent('on' + eventName);
    }
}

// ##################################################################################### Debug methods
var log = function() {
    if (window.console && window.console.log && console.log.apply && debug) {
        console.log.apply(window.console, arguments);
    }
};

// ##################################################################################### Utility methods
/**
 *
 * Copies from one or more objects to another, one by one; vararg method;
 * for performance simplifying sake is NOT
 * null/undefined safe, since is an inner method is the programmer fault if it crashes :);
 *
 * First argument is where to copy to, while the other ones from where to copy;
 *
 * @return the merged object;
 * */
var copy = function() {
    var args = arguments;
    var size = args.length;
    var copyTo = args[0];
    for (var i = 1; i < size; i++) {
        if (!args[i])
            continue;
        for (var x in args[i]) {
            if (args[i].hasOwnProperty(x)) {
                copyTo[x] = args[i][x];
            }
        }
    }
    return copyTo;
};
/**
 * triming regexp;
 */
var trimPatt = /^\s+|\s+$/g;
/**
 * convenient method to trim the white spaces from the begin and end of a string
 *
 * @param {String} string the string to be cropped
 * @return {String} the cropped string
 */
var trim = function(string) {
    return string.replace(trimPatt, '');
};
/**
 * Binds `this` to a method; useful for callbacks where an
 * inner function is set as a callback while keeping it's context;
 * vararg method;
 *
 * first argument is the method reference (not the call), second argument
 * the context the `this` and the rest the arguments passed the method;
 */
var delegate = function(fn, ctx) {
    var args = copy([], arguments);
    var fn = args.shift() || fn;
    var ctx = args.shift() || ctx;

    return function(a, b, c) {
        var callerArgs = copy([a, b, c], arguments);
        return fn.apply(ctx, args.concat(callerArgs));
    };

};

var around = function(ctx, fn, prefn, postfn, extraArg) {
    return function(a, b, c) {
        var callerArgs = reduce([extraArg, a, b, c]);
        var stop = prefn ? prefn.call(ctx, fn, callerArgs) : false;
        var result;
        if (!stop) {
            var fnResult = fn.apply(ctx, callerArgs);
            result = postfn ? postfn.call(ctx, fn, callerArgs, fnResult) : fnResult;
        }
        return result;
    };

};

var reduce = function(arr) {
    var retVal = [];
    var size = arr.length;
    for (var i = 0; i < size; i++) {
        if (arr[i]) {
            retVal.push(arr[i]);
        }
    }
    return retVal;
};

var inherit = function(target, source) {
    copy(target, source);
    for (var x in source.prototype) {
        target.prototype[x] = source.prototype[x];
    }
};

var isType = function(obj, type) {
    var objTypeRaw = Object.prototype.toString.call(obj);
    var match = /^\[object (.*)\]$/g.exec(objTypeRaw);
    var result = false;
    if (match) {
        var typeString = (type + '').toLowerCase();
        result = (typeString === match[1].toLowerCase());
    }
    return result;
};

// ################################################### polyfils
// Object create
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
