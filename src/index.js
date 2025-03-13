import fs from 'fs/promises';
import path from 'path';

function formatDelineator(template, filePath) {
    return template
        .replace(/{{PATH}}/g, filePath)
        .replace(/{{PATH_ABS}}/g, path.resolve(filePath));
}

async function fileStrSequential(paths, encoding, delineator) {
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

async function fileStrParallelOrdered(paths, encoding, delineator) {
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

async function fileStrParallelUnordered(paths, encoding, delineator) {
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

async function fileStr(
    paths,
    {
        encoding = 'utf8',
        concurrency = Concurrency.SEQUENTIAL,
        delineator = '',
    } = {},
) {
    if (concurrency === Concurrency.PARALLEL_ORDERED) {
        return fileStrParallelOrdered(paths, encoding, delineator);
    } else if (concurrency === Concurrency.PARALLEL) {
        return fileStrParallelUnordered(paths, encoding, delineator);
    } else {
        return fileStrSequential(paths, encoding, delineator);
    }
}

export { fileStr, Concurrency };

export default fileStr;
