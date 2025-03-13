import fs from 'fs/promises';
import path from 'path';

function formatDelineator(template, filePath) {
    return template
        .replace(/{{PATH}}/g, filePath)
        .replace(/{{PATH_ABS}}/g, path.resolve(filePath));
}

async function mergeSequential(paths, encoding, delineator) {
    let mergedContent = '';

    for (const fullPath of paths) {
        if (delineator) {
            mergedContent += formatDelineator(delineator, fullPath);
        }

        const content = await fs.readFile(fullPath, encoding).catch((error) => {
            throw new Error(
                `Failed to read file: ${fullPath} - ${error.message}`,
            );
        });

        mergedContent += content;
    }

    return mergedContent;
}

async function mergeParallelOrdered(paths, encoding, delineator) {
    const tasks = paths.map((fullPath, index) =>
        fs
            .readFile(fullPath, encoding)
            .then((content) => ({ index, content, path: fullPath }))
            .catch((error) => {
                throw new Error(
                    `Failed to read file: ${fullPath} - ${error.message}`,
                );
            }),
    );

    const results = await Promise.all(tasks);

    return results
        .sort((a, b) => a.index - b.index)
        .map(
            ({ content, path }) =>
                (delineator ? formatDelineator(delineator, path) : '') +
                content,
        )
        .join('');
}

async function mergeParallelUnordered(paths, encoding, delineator) {
    const results = await Promise.all(
        paths.map(async (fullPath) => {
            const content = await fs
                .readFile(fullPath, encoding)
                .catch((error) => {
                    throw new Error(
                        `Failed to read file: ${fullPath} - ${error.message}`,
                    );
                });

            return { content, path: fullPath };
        }),
    );

    return results
        .map(
            ({ content, path }) =>
                (delineator ? formatDelineator(delineator, path) : '') +
                content,
        )
        .join('');
}

const Concurrency = {
    SEQUENTIAL: 'sequential',
    PARALLEL: 'parallel',
    PARALLEL_ORDERED: 'parallel-ordered',
};

async function merge(
    paths,
    {
        encoding = 'utf8',
        concurrency = Concurrency.SEQUENTIAL,
        delineator = '',
    } = {},
) {
    if (concurrency === Concurrency.PARALLEL_ORDERED) {
        return mergeParallelOrdered(paths, encoding, delineator);
    } else if (concurrency === Concurrency.PARALLEL) {
        return mergeParallelUnordered(paths, encoding, delineator);
    } else {
        return mergeSequential(paths, encoding, delineator);
    }
}

export { merge, Concurrency };

export default merge;
