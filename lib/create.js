
// TODO 动态提示切换
const inquirer = require('inquirer');
const clearConsole = require('../utils/clearConsole');
const Creator = require('./Creator')
const PromptModuleAPI = require('./PromptModuleAPI')
const Generator = require('./Generator')
const path = require('path')
var questions = [
    {
        type: 'input',
        name: 'name',
        message: "What's your name"
    },
    {
        type: 'list',
        name: 'size',
        message: 'What size do you need?',
        choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro']
    }
];

async function create(name) {
    console.log('开始创建初始化项目', name)
    // inquirer.prompt(questions).then(answers => {
    //     console.log(JSON.stringify(answers, null, '  '));
    // });
    const creator = new Creator()
     // 获取各个模块的交互提示语
    const promptModules = getPromptModules()
    const promptApi = new PromptModuleAPI(creator)
    promptModules.forEach(m => m(promptApi))
    console.log(creator.getFinalPrompts(), '---------')

    clearConsole()

    // 弹出交互提示语并获取用户的选择
    const answers = await inquirer.prompt(creator.getFinalPrompts())

    // package.json 文件内容
    const pkg = {
        name,
        version: '0.0.1',
        dependencies: {},
        devDependencies: {},
    }

    const generator = new Generator(pkg, path.join(process.cwd(), name))

    // 填入 vue webpack 必选项，无需用户选择
    answers.features.unshift('vue')
    // answers.features.unshift('vue', 'webpack')

    // 根据用户选择的选项加载相应的模块，在 package.json 写入对应的依赖项
    // 并且将对应的 template 模块渲染
    answers.features.forEach(feature => {
        require(`./generator/${feature}`)(generator, answers)
    })
}

function getPromptModules() {
    return [
        // 'babel',
        'router',
        'vuex',
        // 'linter',
    ].map(file => require(`./promptModules/${file}`))
}

module.exports = create