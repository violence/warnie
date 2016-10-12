# warnie

Simple text error reporter.

## Installation

```
npm i warnie
```

## How to use

```js
const Warnie = require('warnie');
const fs = require('fs');

console.log(new Warnie('Hello world!', __filename, 3, 12)
    .explain(fs.readFileSync(__filename, 'utf-8').split('\n')));
```

### Customization

Best use with [`chalk`](https://www.npmjs.com/package/chalk) (install it with `npm i chalk`).

```
const chalk = require('chalk');

// Colors customization
Warnie.shadowDye = chalk.gray;
Warnie.pointerDye = chalk.red;
Warnie.messageDye = chalk.white;
Warnie.filenameDye = chalk.green;

// Make more or less lines around
Warnie.linesAround = 4;

// Customize line number column format
Warnie.renderLineNumber = line => ` ${('     ' + (line|0)).slice(-4)} | `;

// Or drop that column
Warnie.renderLineNumber = () => '';

// Customize pointer
Warnie.renderPointer = column => `${new Array(column).join(' ')}↑`;
```

### API

```js
/**
 * @param {string} message - text message of error
 * @param {string} filename - name of file the error belongs
 * @param {number} [line=0] - errored line
 * @param {number} [column=0] - errored column
 * @param {number} [severity=0] - severity of the error, one of [-1, 0, 1, 2]
 * @param {Object} [data] - variable data of the error
 */
class Warnie(message, filename, line, column, severity, data) {
    /**
     * @param {string[]} lines - file content splitted by line ends
     * @returns {string} - pretty message with pointer and lines around
     */
    explain(lines) { /* ... */ }
}
```
