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
}