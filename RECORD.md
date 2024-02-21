# vsCode 插件从 0-1

## 安装脚手架

开发 vscode 插件前，我们首先得在全局安装安装 `Yeoman`(一个代码生成器,用以帮助我们生成基本模板文件) 和 `generator-code`(VS Code 插件模版，是一个 VS Code 扩展生成器)

```sh
npm install -g yo generator-code
# or
yarn global add yo generator-code
```

## 生成插件模板

运行以下命令，生成你想要开发的插件类型的模板

```sh
yo code
```

选择一个你想要开发的插件类型

![](https://assets.fedtop.com/picbed/20220707142355.png)

我这里选择了基于 Ts 开发的插件，选择完毕后依次填写相关信息即可。

![](https://assets.fedtop.com/picbed/20220707142408.png)

项目生成完毕后，通过 vscode 打开，会提示你安装一个`TypeScript + Webpack Problem Matchers`扩展，它是一个 Typescript 问题匹配器

你不装也 ok 的，这里我们选择安装它~

![](https://assets.fedtop.com/picbed/20220707142421.png)

## 测试插件

- 只需要在命令面板中输入 Hello World 便可以激活这个模板拓展，弹出一个 Hello World 的消息弹窗。
- 直接摁 F5 调试

## 开始编写插件

## 了解 package.json

这里只对与扩展有关的字段，对于 name 之类的字段，我们平时的开发中就已经很了解他们了。

### name

插件的名称必须用全小写无空格的字母组成。

### displayName

插件市场所显示的插件名称。

### description

简单地描述一下你的插件是做什么的。

### version

version：通过提高版本号的方式就可以使用拓展发布工具来更新已经发布到 VS Code 应用商店的拓展版本

### main

你的插件入口

### license

参考 npm's documentation。如果你在插件根目录已经提供了 LICENSE 文件。那么 license 的值应该是"SEE LICENSE IN <filename>"。

### scripts

等同于 npm 的 scripts，不过有 VS Code 额外字段如 vscode:prepublish 或 vscode:uninstall.

### icon

icon 的文件路径，最小 128x128 像素 (视网膜屏幕则需 256x256)。

### engines

一个至少包含 vscode 字段的对象，其值必须兼容 VS Code 版本。不可以是\*。例如：^0.10.5 表明最小兼容 0.10.5 版本的 VS Code。

### categories

拓展在商店中的种类

### contributes

描述插件发布内容的对象。

### qna(string)

控制市场中的 Q & A 链接。 设置成 marketplace 时，自动使用市场默认的 Q & A 网址。或者提供一个 URL 转跳到你的 Q & A 地址。设置为 false 时禁用。

### extensionDependencies

插件依赖，由插件 ID 组成的数组。当主要插件安装完成后，其他插件会相应安装。插件 ID 的格式为 ${publisher}.${name}。比如：vscode.csharp。

### activationEvents

激活事件数组。

**activationEvents**：扩展的激活方式，支持数组

1. `onLanguage`：当打开为特定语言的文件时, 插件被激活。（注意大小写，支持多个语言）
1. `onCommand`：当调用命令时，插件被激活。
1. `onDebug`：在调试会话开始之前被激活：
   1. `onDebugInitialConfigurations`：onDebugInitialConfigurations 在调用的 provideDebugConfigurations 方法之前触发。
   1. `onDebugResolve`：onDebugResolve:type 在调用指定类型的 resolveDebugConfiguration 方法之前触发。
1. `workspaceContains`：每当打开一个文件夹并且该文件夹包含至少一个与 glob 模式匹配的文件时，插件被激活。
1. `onFileSystem`：每当读取来自特定方案的文件或文件夹时，插件被激活。例如 ftp 或 ssh。
1. `onView`：当在 VS Code 侧栏中展开指定 id 的视图（扩展或源代码管理是内置视图的示例）时，插件被激活。
1. `onUri`：当打开该扩展的系统范围的 Uri 时，插件被激活。
1. `onWebviewPanel`：当 VS Code 需要使用匹配的 viewType 恢复 webview 时，插件被激活。
1. `onCustomEditor`：每当 VS Code 需要创建具有匹配的自定义编辑器时
1. `onAuthenticationRequest`：每当扩展请求具有 authentication.getSession()匹配的 providerId 时激活
1. `onStartupFinished`：vscode 加载完成后激活，类似于 \* 激活事件，但它不会减慢 VS Code 的启动速度。
1. `*`：启动 vscode，插件就会被激活，为了用户体验，官方不推荐这么做。

---

## 调试

通过 F5 即可开启调试模式

![](https://assets.fedtop.com/picbed/202308071053136.png)

同时也会弹出一个新的 vscode 窗口，这个窗口是专门用来调试你的插件的。

## 打包

首先全局安装打包工具`vsce`

```sh
# 已弃用（暂时能正常使用）
npm i vsce -g
# 新的（推荐）
npm i @vscode/vsce -g
```

打包命令

```sh
vsce package
```

需要注意的:  
![](https://assets.fedtop.com/picbed/202202070110836.png)  
![](https://assets.fedtop.com/picbed/202202070110836.png)

必须修改 readme 文件  
![](https://assets.fedtop.com/picbed/202202070135878.png)  
 尽量不要用:activationEvents:'\*' 可替换为:activationEvents:'onStartupFinished' 必须添加 repository 添加 license 文件  
![](https://assets.fedtop.com/picbed/202202070142997.png)

上述问题都 ok 后,就会在当前的目录下生成一个 `.vsix` 文件 ![](https://assets.fedtop.com/picbed/202202070142997.png)

## 安装调试

如图所示，选择从 `VSIX` 安装后,选择生成的.vsix 文件进行安装 ![](https://assets.fedtop.com/picbed/202202031410687.jpg)

也可以通过 vscode 命令面板(摁 F1),选择生成的.vsix 文件进行安装 ![](https://assets.fedtop.com/picbed/202202032045885.png)

当然，如果你不想用`VSIX`也可以，对于只在本地安装自己做的扩展的时候，你只需要把扩展文件复制到`C:\Users\用户名\.vscode\extensions`目录中即可

## 发布

### 创建一个发布者账号

登录 [插件市场](https://marketplace.visualstudio.com/VSCode),这里我直接选择通过 github 账号登录

\*\*\* 不知为何，我在 Chrome 浏览器中始终登录不上,只能在 Edge 浏览器中登录。

### 创建发布者

需要注意的是 vsce create-publisher 命令已被弃用,必须从[这个链接中创建发布者](https://aka.ms/vscode-create-publisher)

### 生成 token

创建完毕后, 你需要生产一个 token

https://dev.azure.com/wangrongding/_usersSettings/tokens

![](https://assets.fedtop.com/picbed/202202070225731.jpg)  
![](https://assets.fedtop.com/picbed/202202070226617.jpg)  
![](https://assets.fedtop.com/picbed/202202070226483.png)

![](https://assets.fedtop.com/picbed/202202070241391.png)  
![](https://assets.fedtop.com/picbed/202202070230076.png)

![](https://assets.fedtop.com/picbed/202202070257156.png)

当上述的行为都完成后,通过 `vsce publish` 命令即可发布(中间需要输入,之前你创建的那个 token)

## 相关链接

- https://dev.azure.com/wangrongding
- http://www.ay1.cc/article/1672711468011642427.html
