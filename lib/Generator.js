const path = require('path')
class Generator {
    constructor(pkg,context) {
        this.pkg = pkg
        this.rootOptions = {}
        this.imports = {}
        this.files = {}
        this.entryFile = `src/main.js`
        this.fileMiddlewares = []
        this.context = context
        this.configTransforms = {}
    }

    async generate() {
        // 从 package.json 中提取文件
        this.extractConfigFiles()
        // 解析文件内容
        await this.resolveFiles()
        // 将 package.json 中的字段排序
        this.sortPkg()
        this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n'
        // 将所有文件写入到用户要创建的目录
        await writeFileTree(this.context, this.files)
    }

    // 将 package.json 中的配置提取出来，生成单独的文件
    // 例如将 package.json 中的
    // babel: {
    //     presets: ['@babel/preset-env']
    // },
    // 提取出来变成 babel.config.js 文件
    extractConfigFiles() {
        const configTransforms = {
            ...defaultConfigTransforms,
            ...this.configTransforms,
            ...reservedConfigTransforms,
        }

        const extract = key => {
            if (configTransforms[key] && this.pkg[key]) {
                const value = this.pkg[key]
                const configTransform = configTransforms[key]
                const res = configTransform.transform(
                    value,
                    this.files,
                    this.context,
                )

                const { content, filename } = res
                // 如果文件不是以 \n 结尾，则补上 \n
                this.files[filename] = ensureEOL(content)
                delete this.pkg[key]
            }
        }

        extract('vue')
        extract('babel')
    }

    // 使用 ejs 解析 lib\generator\xx\template 中的文件
    async resolveFiles() {
        const files = this.files
        for (const middleware of this.fileMiddlewares) {
            await middleware(files, ejs.render)
        }

        // normalize file paths on windows
        // all paths are converted to use / instead of \
        // 将反斜杠 \ 转换为正斜杠 /
        normalizeFilePaths(files)

        // 处理 import 语句的导入和 new Vue() 选项的注入
        // vue-codemod 库，对代码进行解析得到 AST，再将 import 语句和根选项注入
        Object.keys(files).forEach(file => {
            let imports = this.imports[file]
            imports = imports instanceof Set ? Array.from(imports) : imports
            if (imports && imports.length > 0) {
                files[file] = runTransformation(
                    { path: file, source: files[file] },
                    require('./utils/codemods/injectImports'),
                    { imports },
                )
            }

            let injections = this.rootOptions[file]
            injections = injections instanceof Set ? Array.from(injections) : injections
            if (injections && injections.length > 0) {
                files[file] = runTransformation(
                    { path: file, source: files[file] },
                    require('./utils/codemods/injectOptions'),
                    { injections },
                )
            }
        })
    }

    render(source, additionalData = {}, ejsOptions = {}) {
        // 获取调用 generator.render() 函数的文件的父目录路径 
        const baseDir = extractCallDir()
        console.log(baseDir, '----baseDir----')
        // 拼接template路径
        source = path.resolve(baseDir, source)
        this._injectFileMiddleware(async (files) => {
            const data = this._resolveData(additionalData)
            // https://github.com/sindresorhus/globby
            const globby = require('globby')
            // 读取目录中所有的文件
            const _files = await globby(['**/*'], { cwd: source, dot: true })
            for (const rawPath of _files) {
                const sourcePath = path.resolve(source, rawPath)
                // 解析文件内容
                const content = this.renderFile(sourcePath, data, ejsOptions)
                // only set file if it's not all whitespace, or is a Buffer (binary files)
                if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
                    files[rawPath] = content
                }
            }
        })
    }

    _injectFileMiddleware(middleware) {
        this.fileMiddlewares.push(middleware)
    }

    // 合并选项
    _resolveData(additionalData) {
        return { 
            options: this.options,
            rootOptions: this.rootOptions,
            ...additionalData,
        }
    }

    renderFile(name, data, ejsOptions) {
        // 如果是二进制文件，直接将读取结果返回
        if (isBinaryFileSync(name)) {
            return fs.readFileSync(name) // return buffer
        }

        // 返回文件内容
        const template = fs.readFileSync(name, 'utf-8')
        return ejs.render(template, data, ejsOptions)
    }
}

// http://blog.shaochuancs.com/about-error-capturestacktrace/
// 获取调用栈信息
function extractCallDir() {
    const obj = {}
    Error.captureStackTrace(obj)
    // 在 lib\generator\xx 等各个模块中 调用 generator.render()
    // 将会排在调用栈中的第四个，也就是 obj.stack.split('\n')[3]
    const callSite = obj.stack.split('\n')[3]

    // the regexp for the stack when called inside a named function
    const namedStackRegExp = /\s\((.*):\d+:\d+\)$/
    // the regexp for the stack when called inside an anonymous
    const anonymousStackRegExp = /at (.*):\d+:\d+$/

    let matchResult = callSite.match(namedStackRegExp)
    if (!matchResult) {
        matchResult = callSite.match(anonymousStackRegExp)
    }

    const fileName = matchResult[1]
    // 获取对应文件的目录
    return path.dirname(fileName)
}

module.exports = Generator