/* *******************************************************
 * filestr
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
 * package_name: filestr
 * file_name: gen/index.cjs
 * purpose: {{PURPOSE}}
 *  
 * @system
 *
 * generated_on: 2025-03-13T00:34:51.125Z
 * certified_version: 1.0.0
 * file_uuid: e6d961c1-01ae-45c3-8526-6958bfc871d6
 * file_size: 4129 bytes
 * file_hash: 55f0e48484e474c2ee9d9cf6ee321ece6f04d202ec8452ef41d96e0ce4bdb984
 * mast_hash: 1d1f6554dc8323c644be2f3963160efe6dcc2a277e81cf15a339d671bb8b8609
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
  fileStr: () => fileStr
});
module.exports = __toCommonJS(index_exports);
var import_promises = __toESM(require("fs/promises"), 1);
var import_path = __toESM(require("path"), 1);
function formatDelineator(template, filePath) {
  return template.replace(/{{PATH}}/g, filePath).replace(/{{PATH_ABS}}/g, import_path.default.resolve(filePath));
}
async function fileStrSequential(paths, encoding, delineator) {
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
async function fileStrParallelOrdered(paths, encoding, delineator) {
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
async function fileStrParallelUnordered(paths, encoding, delineator) {
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
async function fileStr(paths, {
  encoding = "utf8",
  concurrency = Concurrency.SEQUENTIAL,
  delineator = ""
} = {}) {
  if (concurrency === Concurrency.PARALLEL_ORDERED) {
    return fileStrParallelOrdered(paths, encoding, delineator);
  } else if (concurrency === Concurrency.PARALLEL) {
    return fileStrParallelUnordered(paths, encoding, delineator);
  } else {
    return fileStrSequential(paths, encoding, delineator);
  }
}
var index_default = fileStr;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Concurrency,
  fileStr
});
