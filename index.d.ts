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
export function fileStr(
    paths: string[],
    options?: MergeOptions,
): Promise<string>;

export default fileStr;
