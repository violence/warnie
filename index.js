module.exports = Warnie;

/**
 * The warnie
 *
 * @class
 * @name Warnie
 * @param {string} message
 * @param {string} filename
 * @param {?number=0} line
 * @param {?number=0} column
 * @param {?number=0} severity (-1, 0, 1, 2)
 * @param {?string} rule
 * @param {?*} data
 */
function Warnie(message, filename, line, column, severity, rule, data) {
    this.message = message + "";
    this.filename = filename + "";
    this.line = line|0;
    this.column = column|0;
    this.severity = severity|0;
    this.rule = rule + "";
    this.data = data;
}

/** @type {function(s: string): string} */
Warnie.shadowDye = noop;

/** @type {function(s: string): string} */
Warnie.messageDye = noop;

/** @type {function(s: string): string} */
Warnie.fileDye = noop;

/** @type {number} */
Warnie.linesAround = 2;

/**
 * Formats error for further output.
 *
 * @param {string[]} lines - Source file lines
 * @returns {string}
 */
Warnie.prototype.explain = function(lines) {
    var result = [
        renderLine(this.line, lines[this.line]),
        this.shadowDye(this.renderPointer(this.column))
    ];

    var i = this.line - 1;
    while (i >= 0 && i >= (this.line - this.constructor.linesAround)) {
        result.unshift(renderLine(i, lines[i]));
        i--;
    }
    i = this.line + 1;
    while (i < lines.length && i <= (this.line + this.constructor.linesAround)) {
        result.push(renderLine(i, lines[i]));
        i++;
    }

    result.unshift(this.constructor.messageDye(this.message) + ' at '
        + this.constructor.filenameDye(this.filename) + ' :');

    return result.join('\n');
};

/**
 * Renders prefix for single code line.
 *
 * @param {number} line - line number
 * @returns {string}
 */
Warnie.renderLineNumber = function(line) {
    // "line + 1" to print lines in human way (counted from 1)
    return ' ' + lpad(line|0 + 1, 5) + ' |';
};

/**
 * Renders pointer:
 * ---------------^
 *
 * @param {number} column
 * @returns {string}
 */
Warnie.renderPointer = function(column) {
    return (new Array(column + this.renderLineNumber(0).length + 1)).join('-') + '^';
};

/**
 * Simple util for prepending spaces to the string until it fits specified size.
 *
 * @param {string} s
 * @param {number} len
 * @returns {string}
 */
function lpad(s, len) {
    s = "" + s;
    while (s.length < len) {
        s = ' ' + s;
    }
    return s;
}

/**
 * Returns the first argument
 *
 * @param {string} s
 * @returns {string}
 */
function noop(s) {
    return s;
}

/**
 * Renders line.
 *
 * @param {number} lineNumber
 * @param {string} line
 * @returns {string}
 */
function renderLine(lineNumber, line) {
    return Warnie.shadowDye(Warnie.renderLineNumber(lineNumber))
        + line.replace(/\t/g, ' ');
}
