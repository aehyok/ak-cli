// https://blog.csdn.net/qq_31967569/article/details/82461499
module.exports = (api) => {
    console.log('vuex')
    api.injectFeature({
        name: 'Vuex',
        value: 'vuex',
        description: '数据状态管理依赖包',
        link: 'https://next.vuex.vuejs.org/zh/',
    })
}