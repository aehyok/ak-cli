const chalk = require('chalk')

module.exports = (api) => {
    api.injectFeature({
        name: 'Router',
        value: 'router',
        description: '前端路由官方依赖包',
        link: 'https://next.router.vuejs.org/zh/introduction.html/',
    })
}