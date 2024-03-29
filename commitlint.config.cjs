// .commitlintrc.js
/** @type {import('cz-git').UserConfig} */
module.exports = {
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: '选择你要提交的类型 :',
      subject: '填写简短精炼的变更描述 :\n',
      confirmCommit: '是否提交或修改commit ?'
    },
    types: [
      { value: '特性', name: '特性:     新增功能' },
      { value: '修复', name: '修复:     修复缺陷' },
      { value: '文档', name: '文档:     文档变更' },
      { value: '格式', name: '格式:     代码格式（不影响功能，例如空格、分号等格式修正）' },
      { value: '重构', name: '重构:     代码重构（不包括 bug 修复、功能新增）' },
      { value: '性能', name: '性能:     性能优化' },
      { value: '测试', name: '测试:     添加疏漏测试或已有测试改动' },
      { value: '构建', name: '构建:     构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）' },
      { value: '集成', name: '集成:     修改 CI 配置、脚本' },
      { value: '回退', name: '回退:     回滚 commit' },
      { value: '其他', name: '其他:     对构建过程或辅助工具和库的更改（不影响源文件、测试用例）' },
    ],
    useEmoji: false,
    emojiAlign: 'center',
    themeColorCode: '',
    upperCaseSubject: false,
    skipQuestions: [
      'scope', 'body', 'breaking', 'footerPrefix', 'footer'
    ],
    confirmColorize: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: Infinity,
    minSubjectLength: 0,
    defaultSubject: ''
  }
}
