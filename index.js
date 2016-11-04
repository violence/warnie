module.exports = Warnie;

/**
 * The warnie
 *
 * @class
 * @name Warnie
 * @param {string} message - text message of error
 * @param {string} filename - name of file the error belongs
 * @param {number} [line=1] - errored line
 * @param {number} [column=1] - errored column
 * @param {number} [severity=0] - severity of the error
 * @param {Object} [data] - variable data of the error
 */
function Warnie(message, filename, line, column, severity, data) {
    this.message = message + '';
    this.filename = filename + '';
    this.line = line||1;
    this.column = column||1;
    this.severity = severity|0;
    this.data = data;
}

/** @type {function(s: string): string} */
Warnie.shadowDye = noop;

/** @type {function(s: string): string} */
Warnie.pointerDye = noop;

/** @type {function(s: string): string} */
Warnie.messageDye = noop;

/** @type {function(s: string): string} */
Warnie.filenameDye = noop;

/** @type {number} */
Warnie.linesAround = 2;

/**
 * Formats error for further output.
 *
 * @param {string[]} lines - Source file content splitted by line ends
 * @returns {string} - pretty message with pointer and lines around
 */
Warnie.prototype.explain = function(lines) {
    var humanLine = this.line - 1;
    var pointer = Warnie.renderPointer(Warnie.renderLineNumber(0).length + this.column);
    var result = [
        renderLine(humanLine, lines[humanLine]),
        Warnie.shadowDye(pointer.slice(0, -1)) + Warnie.pointerDye(pointer.slice(-1))
    ];

    // Prepend lines before the current one
    var i = humanLine - 1;
    while (i >= 0 && i >= (humanLine - Warnie.linesAround)) {
        result.unshift(renderLine(i, lines[i]));
        i--;
    }

    // Append lines after the current one
    i = humanLine + 1;
    while (i < lines.length && i <= (humanLine + Warnie.linesAround)) {
        result.push(renderLine(i, lines[i]));
        i++;
    }

    // Prepend error info
    var loc = humanLine ? (':' + humanLine + (this.column ? ':' + this.column : '')) : '';
    result.unshift(Warnie.messageDye(this.message) + ' at '
        + Warnie.filenameDye(this.filename) + loc + ' :');

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
    return ' ' + lpad((line|0) + 1, 5) + ' | ';
};

/**
 * Renders pointer:
 * ---------------^
 *
 * @param {number} column - column number for pointer
 * @returns {string}
 */
Warnie.renderPointer = function(column) {
    return (new Array(column)).join('-') + '^';
};

/**
 * Simple util for prepending spaces to the string until it fits specified size.
 *
 * @param {string} s - source string
 * @param {number} len - padding length
 * @returns {string}
 */
function lpad(s, len) {
    s = '' + s;
    while (s.length < len) {
        s = ' ' + s;
    }
    return s;
}

/**
 * Returns the first argument
 *
 * @param {string} s - source string
 * @returns {string} - source string
 */
function noop(s) {
    return s;
}

/**
 * Renders line.
 *
 * @param {number} lineNumber - line number to print
 * @param {string} line - source text of line
 * @returns {string} - formatted text of line to print
 */
function renderLine(lineNumber, line) {
    return Warnie.shadowDye(Warnie.renderLineNumber(lineNumber))
        + line.replace(/\t/g, ' ');
}
