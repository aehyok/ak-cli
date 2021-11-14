class Creator {
    constructor() {
        // 列出当前脚手架下所配置的特性依赖模块
        this.featurePrompt = {
            name: 'features',
            message: '请选择项目所需要的模块，可多选（通过上下箭头移动，通过空格选中）:',
            pageSize: 10,
            type: 'checkbox',
            choices: [],
        }

        this.injectedPrompts = []
    }

    getFinalPrompts() {
        this.injectedPrompts.forEach(prompt => {
            const originalWhen = prompt.when || (() => true)
            prompt.when = answers => originalWhen(answers)
        })
    
        const prompts = [
            this.featurePrompt,
            ...this.injectedPrompts,
        ]
    
        return prompts
    }
}

module.exports = Creator