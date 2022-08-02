# ak-vue3

ak-vue3 脚手架搭建

- 1、如何通过命令行开始创建项目（commander 依赖包）
  在 package.json 根目录执行 npm link 注册本地执行命令
  `javascript "bin": { "ak-vue": "./bin/mvc.js" }, `

那么就可以通过 ak-vue create demo 创建项目

- 2、如何通过交互提示进行选择基本框架（inquirer 依赖包）


## 1、先全局安装脚手架
```javascript
// 全局安装aehyok-cli
npm i aehyok-cli -g
```

## 2、使用两个指令
```javascript
ak-vue create
ak-vite create
```
