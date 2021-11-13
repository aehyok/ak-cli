// https://blog.csdn.net/qq_31967569/article/details/82461499
module.exports = (api) => {
    console.log('vuex')
    api.injectFeature({
        name: 'Vuex',
        value: 'vuex',
        description: 'Manage the app state with a centralized store',
        link: 'https://vuex.vuejs.org/',
    })
}