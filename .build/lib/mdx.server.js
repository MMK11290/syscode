"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentDirectory = void 0;
exports.getAllMdxFiles = getAllMdxFiles;
exports.filePathToSlug = filePathToSlug;
exports.getPostBySlug = getPostBySlug;
exports.getAllPosts = getAllPosts;
exports.getStaticPathsFromPosts = getStaticPathsFromPosts;
exports.getPlainTextFromMdx = getPlainTextFromMdx;
var fs_1 = require("fs");
var path = require("path");
var gray_matter_1 = require("gray-matter");
var serialize_1 = require("next-mdx-remote/serialize");
var rehype_highlight_1 = require("rehype-highlight");
var remark_1 = require("remark");
var remark_mdx_1 = require("remark-mdx");
var remove_markdown_1 = require("remove-markdown");
var unist_util_visit_1 = require("unist-util-visit");
/** Path to the MDX content root directory */
exports.contentDirectory = path.join(process.cwd(), 'src', 'contents');
/**
 * Recursively reads all .mdx files under a directory and returns full absolute paths.
 * - Uses a safe optional fileList param to avoid mutable default traps.
 * @param dir absolute directory path (default: contentDirectory)
 * @param fileList optional accumulator (will be initialized if omitted)
 * @returns array of absolute file paths (strings) ending with .mdx
 */
function getAllMdxFiles(dir, fileList) {
    if (dir === void 0) { dir = exports.contentDirectory; }
    fileList = fileList !== null && fileList !== void 0 ? fileList : [];
    var entries = fs_1.default.readdirSync(dir, { withFileTypes: true });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            getAllMdxFiles(fullPath, fileList);
        }
        else if (entry.isFile() && entry.name.toLowerCase().endsWith('.mdx')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}
/**
 * Converts a full MDX file path to a slug array for routing.
 * E.g. "/.../src/contents/linux/tips.mdx" -> ['linux', 'tips']
 * E.g. "/.../src/contents/linux/index.mdx" -> ['linux']
 *
 * Uses path.parse for cross-platform safety.
 * @param filePath absolute path to the .mdx file
 */
function filePathToSlug(filePath) {
    var relPath = path.relative(exports.contentDirectory, filePath);
    // Use path.parse to reliably get dir and name
    var parsed = path.parse(relPath);
    var dirPart = parsed.dir ? parsed.dir.split(path.sep).filter(Boolean) : [];
    var name = parsed.name; // does NOT include extension
    if (name.toLowerCase() === 'index') {
        return dirPart;
    }
    return __spreadArray(__spreadArray([], dirPart, true), [name], false);
}
/**
 * Loads a single MDX file given a slug (array of segments), parses frontmatter,
 * serializes MDX for next-mdx-remote, and returns structured data.
 *
 * Behavior:
 * - If slugArray is empty ([]) it will try to read `${contentDirectory}/index.mdx`
 * - Throws a descriptive Error if the resolved file does not exist or read fails
 *
 * @param slugArray array of path segments like ['linux', 'tips']
 */
function getPostBySlug(slugArray) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvedPath, raw, _a, dataRaw, content, frontMatter, rehypePlugins, mdxSource, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!Array.isArray(slugArray)) {
                        throw new TypeError('getPostBySlug expects slugArray: string[]');
                    }
                    if (slugArray.length === 0) {
                        resolvedPath = path.join(exports.contentDirectory, 'index.mdx');
                    }
                    else {
                        resolvedPath = path.join.apply(path, __spreadArray([exports.contentDirectory], slugArray, false)) + '.mdx';
                    }
                    if (!fs_1.default.existsSync(resolvedPath)) {
                        throw new Error("MDX file not found: ".concat(resolvedPath));
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    raw = fs_1.default.readFileSync(resolvedPath, 'utf-8');
                    _a = (0, gray_matter_1.default)(raw), dataRaw = _a.data, content = _a.content;
                    frontMatter = (dataRaw && typeof dataRaw === 'object') ? dataRaw : {};
                    rehypePlugins = [rehype_highlight_1.default];
                    return [4 /*yield*/, (0, serialize_1.serialize)(content, {
                            mdxOptions: {
                                rehypePlugins: rehypePlugins,
                            },
                        })];
                case 2:
                    mdxSource = _b.sent();
                    return [2 /*return*/, {
                            slug: slugArray,
                            frontMatter: frontMatter,
                            mdxSource: mdxSource,
                        }];
                case 3:
                    err_1 = _b.sent();
                    // Wrap with context to help debugging at runtime
                    throw new Error("Failed to load/serialize MDX at ".concat(resolvedPath, ": ").concat(err_1.message));
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Reads all MDX files recursively and returns an array of `{ slug, frontMatter }`
 * Useful for creating index pages or generating `getStaticPaths`.
 */
function getAllPosts() {
    var files = getAllMdxFiles(exports.contentDirectory);
    var posts = files.map(function (filePath) {
        var slug = filePathToSlug(filePath);
        var raw = fs_1.default.readFileSync(filePath, 'utf-8');
        var dataRaw = (0, gray_matter_1.default)(raw).data;
        var frontMatter = (dataRaw && typeof dataRaw === 'object') ? dataRaw : {};
        return { slug: slug, frontMatter: frontMatter };
    });
    return posts;
}
/**
 * Optional helper that returns a list of paths suitable for Next.js getStaticPaths
 * Example: [{ params: { slug: ['linux','tips'] } }, ...]
 */
function getStaticPathsFromPosts() {
    return getAllPosts().map(function (p) { return ({ params: { slug: p.slug } }); });
}
/**
 * Extracts plain text from MDX content, stripping code blocks, JSX, and formatting.
 * Uses remark to parse MDX, removes code nodes, then strips to plain text.
 * @param content MDX content string (after frontmatter)
 * @returns Plain text string
 */
function getPlainTextFromMdx(content) {
    return __awaiter(this, void 0, void 0, function () {
        var processor, tree, mdString, plainText;
        return __generator(this, function (_a) {
            try {
                processor = (0, remark_1.remark)().use(remark_mdx_1.default);
                tree = processor.parse(content);
                // Remove code blocks to avoid indexing code
                (0, unist_util_visit_1.visit)(tree, 'code', function (_node, index, parent) {
                    if (parent && index !== undefined) {
                        parent.children.splice(index, 1);
                        return [unist_util_visit_1.SKIP, index];
                    }
                    return unist_util_visit_1.CONTINUE;
                });
                mdString = processor.stringify(tree);
                plainText = (0, remove_markdown_1.default)(mdString).replace(/\n+/g, ' ').trim();
                return [2 /*return*/, plainText];
            }
            catch (err) {
                console.error('Error extracting plain text from MDX:', err);
                return [2 /*return*/, '']; // Fallback to empty on error
            }
            return [2 /*return*/];
        });
    });
}
