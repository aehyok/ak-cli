module.exports = (generator) => {
    generator.render('./template')

    generator.extendPackage({
        dependencies: {
            vue: '^3.2.16',
        },
        devDependencies: {
            'vue-template-compiler': '^2.6.12',
        },
    })

    generator.extendPackage({
        browserslist: [
            '> 1%',
            'last 2 versions',
            'not dead',
        ],
    })
}