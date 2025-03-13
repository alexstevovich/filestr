/* *******************************************************
 * filemerge
 * 
 * @license
 * 
 * Apache-2.0
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * @meta
 *
 * package_name: filemerge
 * file_name: gen/index.cjs
 * purpose: {{PURPOSE}}
 *  
 * @system
 *
 * generated_on: 2025-03-13T00:10:52.802Z
 * certified_version: 1.0.0
 * file_uuid: 28ce218d-5620-4472-9dd0-6e5ef5366c09
 * file_size: 4107 bytes
 * file_hash: 05a33337daeaf19d4d04349c11d6b86a6e0b09273c8344691b88cfd10a3a684c
 * mast_hash: 0b48a66518bf725fcc8b0ce14a9962ce6520fa02cb7af929d3c3b0d1d8b74f30
 * generated_by: preamble on npm!
 *
 * [Preamble Metadata]
********************************************************/ 
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var index_exports = {};
__export(index_exports, {
  Concurrency: () => Concurrency,
  default: () => index_default,
  merge: () => merge
});
module.exports = __toCommonJS(index_exports);
var import_promises = __toESM(require("fs/promises"), 1);
var import_path = __toESM(require("path"), 1);
function formatDelineator(template, filePath) {
  return template.replace(/{{PATH}}/g, filePath).replace(/{{PATH_ABS}}/g, import_path.default.resolve(filePath));
}
async function mergeSequential(paths, encoding, delineator) {
  let mergedContent = "";
  for (const fullPath of paths) {
    if (delineator) {
      mergedContent += formatDelineator(delineator, fullPath);
    }
    const content = await import_promises.default.readFile(fullPath, encoding).catch((error) => {
      throw new Error(
        `Failed to read file: ${fullPath} - ${error.message}`
      );
    });
    mergedContent += content;
  }
  return mergedContent;
}
async function mergeParallelOrdered(paths, encoding, delineator) {
  const tasks = paths.map(
    (fullPath, index) => import_promises.default.readFile(fullPath, encoding).then((content) => ({ index, content, path: fullPath })).catch((error) => {
      throw new Error(
        `Failed to read file: ${fullPath} - ${error.message}`
      );
    })
  );
  const results = await Promise.all(tasks);
  return results.sort((a, b) => a.index - b.index).map(
    ({ content, path: path2 }) => (delineator ? formatDelineator(delineator, path2) : "") + content
  ).join("");
}
async function mergeParallelUnordered(paths, encoding, delineator) {
  const results = await Promise.all(
    paths.map(async (fullPath) => {
      const content = await import_promises.default.readFile(fullPath, encoding).catch((error) => {
        throw new Error(
          `Failed to read file: ${fullPath} - ${error.message}`
        );
      });
      return { content, path: fullPath };
    })
  );
  return results.map(
    ({ content, path: path2 }) => (delineator ? formatDelineator(delineator, path2) : "") + content
  ).join("");
}
const Concurrency = {
  SEQUENTIAL: "sequential",
  PARALLEL: "parallel",
  PARALLEL_ORDERED: "parallel-ordered"
};
async function merge(paths, {
  encoding = "utf8",
  concurrency = Concurrency.SEQUENTIAL,
  delineator = ""
} = {}) {
  if (concurrency === Concurrency.PARALLEL_ORDERED) {
    return mergeParallelOrdered(paths, encoding, delineator);
  } else if (concurrency === Concurrency.PARALLEL) {
    return mergeParallelUnordered(paths, encoding, delineator);
  } else {
    return mergeSequential(paths, encoding, delineator);
  }
}
var index_default = merge;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Concurrency,
  merge
});
