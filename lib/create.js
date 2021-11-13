
var inquirer = require('inquirer');
const Creator = require('./Creator')
const PromptModuleAPI = require('./PromptModuleAPI')

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

function create(name) {
    console.log('开始创建初始化项目', name)
    // inquirer.prompt(questions).then(answers => {
    //     console.log(JSON.stringify(answers, null, '  '));
    // });
    
    const creator = new Creator()
     // 获取各个模块的交互提示语
     const promptModules = getPromptModules()
     const promptApi = new PromptModuleAPI(creator)
     promptModules.forEach(m => m(promptApi))
     console.log(promptApi, '---------')

}

function getPromptModules() {
    return [
        // 'babel',
        // 'router',
        'vuex',
        // 'linter',
    ].map(file => require(`./promptModules/${file}`))
}

module.exports = create