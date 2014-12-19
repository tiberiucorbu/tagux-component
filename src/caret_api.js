 
var CaretAPI = {
    /**
    * Author :   kd7 (http://stackoverflow.com/users/7280/kd7)
    * Original : http://stackoverflow.com/a/512542/2406376 
    */
    
    setCaretPosition : function(elem, caretPos) {
        if (elem != null) {
            if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.moveStart('character', caretPos.start);
                var text = range.text;
                range.moveEnd('character', 0);
                var endPos = caretPos.end - (text.length+caretPos.start);
                range.moveEnd('character', endPos);
                range.select();
            } else if (elem.selectionStart) {
                elem.setSelectionRange(caretPos.start, caretPos.end);
            }
        }
    },      
    getCaretPosition : function(el) {
        var start = 0, end = 0, normalizedValue, textInputRange, len, endRange;
        // Firefox
        if ( typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
            start = el.selectionStart;
            end = el.selectionEnd;
            // Internet Exploder
        } else {
            var range = document.selection.createRange();
            if (range && range.parentElement() == el) {
                len = el.value.length;
                normalizedValue = el.value.replace(/\r\n/g, "\n");

                // Create a working TextRange that lives only in the input
                textInputRange = el.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());

                // Check if the start and end of the selection are at the very end
                // of the input, since moveStart/moveEnd doesn't return what we want
                // in those cases
                endRange = el.createTextRange();
                endRange.collapse(false);

                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                    start = end = len;
                } else {
                    start = -textInputRange.moveStart("character", -len);
                    start += normalizedValue.slice(0, start).split("\n").length - 1;

                    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                        end = len;
                    } else {
                        end = -textInputRange.moveEnd("character", -len);
                        end += normalizedValue.slice(0, end).split("\n").length - 1;
                    }
                }
            }
        }

        return {
            start : start,
            end : end
        };

    }
};
