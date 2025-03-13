/* *******************************************************
 * filemerge TypeScript Definitions
 *
 * @license Apache-2.0
 *
 * Copyright 2016-2025 Alex Stevovich
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * [TypeScript Definitions]
 ********************************************************/

/// <reference types="node" />

export type ConcurrencyType = 'sequential' | 'parallel' | 'parallel-ordered';

/**
 * Available concurrency modes for merging files.
 */
export const Concurrency: {
    SEQUENTIAL: 'sequential';
    PARALLEL: 'parallel';
    PARALLEL_ORDERED: 'parallel-ordered';
};

/**
 * Options for the `merge` function.
 */
export interface MergeOptions {
    /**
     * File encoding type. Defaults to `'utf8'`.
     */
    encoding?: BufferEncoding;

    /**
     * Controls how files are read:
     * - `'sequential'`: Reads files one by one in order.
     * - `'parallel'`: Reads files concurrently, but order is not guaranteed.
     * - `'parallel-ordered'`: Reads files concurrently, but maintains order.
     *
     * Defaults to `'sequential'`.
     */
    concurrency?: ConcurrencyType;

    /**
     * A string to insert between files (e.g., section headers).
     * Supports placeholders:
     * - `{{PATH}}` → Relative file path.
     * - `{{PATH_ABS}}` → Absolute file path.
     *
     * Defaults to `''` (no separator).
     */
    delineator?: string;
}

/**
 * Merges the content of multiple files into a single string.
 *
 * @param paths - An array of file paths to merge.
 * @param options - Configuration options for encoding, concurrency, and delimiters.
 * @returns A `Promise<string>` containing the merged file content.
 */
export function merge(paths: string[], options?: MergeOptions): Promise<string>;

export default merge;
