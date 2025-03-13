import { describe, it, expect, beforeAll } from 'vitest';
import { fileStr, Concurrency } from '../src/index.js'; // Adjust path if necessary
import path from 'path';
import fs from 'fs/promises';

const testDir = './test/res';
const files = [
    path.join(testDir, 'file1.txt'),
    path.join(testDir, 'file2.txt'),
    path.join(testDir, 'folder2', 'file3.txt'),
];

let expectedContents = {};

beforeAll(async () => {
    expectedContents = {
        file1: (await fs.readFile(files[0], 'utf8'))
            .replace(/\r\n/g, '\n')
            .trim(),
        file2: (await fs.readFile(files[1], 'utf8'))
            .replace(/\r\n/g, '\n')
            .trim(),
        file3: (await fs.readFile(files[2], 'utf8'))
            .replace(/\r\n/g, '\n')
            .trim(),
    };
});

describe('merge()', () => {
    it('should merge files sequentially without a delineator', async () => {
        const result = (
            await fileStr(files, { concurrency: Concurrency.SEQUENTIAL })
        )
            .replace(/\r\n/g, '\n')
            .trim();
        expect(result).toBe(
            `${expectedContents.file1}${expectedContents.file2}${expectedContents.file3}`,
        );
    });

    it('should merge files in parallel unordered', async () => {
        const result = (
            await fileStr(files, { concurrency: Concurrency.PARALLEL })
        )
            .replace(/\r\n/g, '\n')
            .trim();
        expect(result).toContain(expectedContents.file1);
        expect(result).toContain(expectedContents.file2);
        expect(result).toContain(expectedContents.file3);
    });

    it('should merge files in parallel ordered', async () => {
        const result = (
            await fileStr(files, { concurrency: Concurrency.PARALLEL_ORDERED })
        )
            .replace(/\r\n/g, '\n')
            .trim();
        expect(result).toBe(
            `${expectedContents.file1}${expectedContents.file2}${expectedContents.file3}`,
        );
    });

    it('should merge files with a delineator using {{PATH}}', async () => {
        const delineator = '--- {{PATH}} ---';
        const result = (
            await fileStr(files, {
                concurrency: Concurrency.SEQUENTIAL,
                delineator,
            })
        )
            .replace(/\r\n/g, '\n')
            .trim();

        const expectedOutput = files
            .map(
                (file) =>
                    `--- ${file} ---${expectedContents[path.basename(file, '.txt')]}`,
            )
            .join('');

        expect(result).toBe(expectedOutput);
    });

    it('should merge files with a delineator using {{PATH_ABS}}', async () => {
        const delineator = '--- {{PATH_ABS}} ---';
        const result = (
            await fileStr(files, {
                concurrency: Concurrency.SEQUENTIAL,
                delineator,
            })
        )
            .replace(/\r\n/g, '\n')
            .trim();

        const expectedOutput = files
            .map((file) => {
                const absPath = path.resolve(file);
                return `--- ${absPath} ---${expectedContents[path.basename(file, '.txt')]}`;
            })
            .join('');

        expect(result).toBe(expectedOutput);
    });
});
