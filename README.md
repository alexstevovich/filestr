# filestr

Takes a list of files and combines their contents into a single string. A minimal and atomic function.

## Install

```bash
npm install filestr
```

## Usage

```js
import fileStr from 'filestr';

const files = [
    './test/res/test1.txt',
    './test/res/test2.txt',
    './test/res/test3.txt',
];

const mergedContent = await fileStr(files);
console.log(mergedContent); // Outputs the merged file content as a string
```

## API

### `fileStr(files, options?)`

Merges the content of multiple files into a single string.

#### Parameters:

- `files: string[]` – An array of file paths to merge.
- `options?: object` (optional) – Configuration options:
    - `encoding: string` (default: `'utf8'`) – The file encoding.
    - `concurrency: 'sequential' | 'parallel' | 'parallel-ordered'` (default: `'sequential'`) – Controls how files are read:
        - `'sequential'`: Reads files one by one in order.
        - `'parallel'`: Reads files concurrently, but order is not guaranteed.
        - `'parallel-ordered'`: Reads files concurrently, but maintains order.
    - `delineator: string` (default: `''`) – A string to insert between files.

#### Returns:

A `Promise<string>` containing the merged file content.

## Links

### Development Homepage:

[https://github.com/alexstevovich/filestr](https://github.com/alexstevovich/filestr)

_This link might become filestr-node in the future._

## License

Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
