module.exports = {
  arrowParens: 'avoid', //(x)=>{} 箭头函数参数只有一个时是否需要有小括号
  bracketSpacing: true, //在对象、数组括号与文字之前加空格 ”{ foo : bar }“
  endOfLine: 'auto', //结尾是/n /r /n/r auto
  htmlWhitespaceSensitivity: 'ignore',
  insertPragma: false,
  jsxSingleQuote: true, //在jsx中使用单引号代替双引号
  printWidth: 120, //超过最大值换行
  proseWrap: 'preserve', //默认值，因为使用了一些折行敏感型的渲染器（如Github comment）而按照markdown文件样式进行折行
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: false, //句尾添加分号
  singleQuote: true, //使用单引号代替双引号
  tabWidth: 2, //缩进字节数
  trailingComma: 'es5',
  useTabs: false, //缩进不使用Tab，使用空格
  vueIndentScriptAndStyle: true,
}
