
var inquirer = require('inquirer');

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
    inquirer.prompt(questions).then(answers => {
        console.log(JSON.stringify(answers, null, '  '));
    });
}

module.exports = create