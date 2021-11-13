module.exports = class PromptModuleAPI {
    constructor(creator) {
        this.creator = creator
    }

    injectFeature(feature) {
        console.log('0000000')
        this.creator.featurePrompt.choices.push(feature)
        console.log(this.creator.featurePrompt.choices)
    }

    injectPrompt(prompt) {
        this.creator.injectedPrompts.push(prompt)
    }
}