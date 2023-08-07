// 模块vscode包含 vscode 的扩展性API
import * as vscode from "vscode";
const querystring = require("querystring");
const http = require("http");
// 当你的扩展被激活时，这个方法被调用
// 扩展功能在第一次执行命令时就被激活
export function activate(context: vscode.ExtensionContext) {
  // 当你的扩展被激活时，这行代码将只被执行一次
  console.log("Congratulations,扩展 fanyi 已经激活!");

  //注册hover事件
  vscode.languages.registerHoverProvider("*", {
    provideHover: handleSelectTextHover,
  });

  //注册命令，回调函数接收一个可选参数uri
  let disposable = vscode.commands.registerCommand("test-command", uri => {
    vscode.window.showInformationMessage("当前文件路径:" + uri);
  });
  //文本编辑器命令与普通命令不同，它们仅在有被编辑器被激活时调用才生效，此外，这个命令可以访问到当前活动编辑器textEditor
  let editorCommand = vscode.commands.registerTextEditorCommand("editorCommand", (textEditor, edit) => {
    console.log(textEditor, edit);
  });
  context.subscriptions.push(disposable, editorCommand);
}

//hover事件
async function handleSelectTextHover(document: vscode.TextDocument, position: vscode.Position) {
  const editor = vscode.window.activeTextEditor;
  const selection = editor?.selection;
  // No open text editor or no selection
  if (!editor || !selection || !selection.contains(position)) return;
  const text = editor.document.getText(selection);
  if (text) {
    console.log("🚀🚀🚀 / text", text, selection);
    let res = (await translation(text)) as any;
    let content = formatText(res);
    const markdownString = new vscode.MarkdownString();
    markdownString.appendMarkdown(content);
    markdownString.supportHtml = true;
    markdownString.isTrusted = true;
    return new vscode.Hover(markdownString);
  }
}

// 请求翻译
function translation(text: string) {
  let query = querystring.escape(
    text
      .replace(/([A-Z])/g, " $1")
      .replace(/-/g, " ")
      .toLowerCase()
  );
  let options = `http://aidemo.youdao.com/trans?q=${query}&&from=Auto&&to=Auto`;

  return new Promise((resolve, reject) => {
    // 处理响应的回调函数
    function callback(response: any) {
      response.setEncoding("utf-8");
      // 不断更新数据
      response.on("data", function (data: any) {
        let result = JSON.parse(data);
        resolve(result);
      });

      response.on("end", function () {});
    }
    // 向服务端发送请求
    let req = http.request(options, callback);
    req.end();
  });
}

// 格式化翻译结果
function formatText(res: any) {
  let content = "### 翻译：\n";
  let phonetic = "**发音:**  \n";
  let explains = "**翻译:**  \n";
  let webTrans = "**网络释义:**";
  let machineTrans = `  \n**机器翻译:** ${res.translation || ""}  \n`;
  let footer = `\n
<p align="center">
  <a href="https://github.com/wangrongding" target="_blank" rel="noopener noreferrer">
    Follow me on github
  </a>
</p>
\n`;
  // console.log("🚀🚀🚀 / res", res);
  // console.log("🚀🚀🚀 / phonetic", res.basic.phonetic);

  if (res.basic) {
    phonetic = `**发音:** ${res.basic.phonetic ? "[ " + res.basic.phonetic + " ]" : "无"}  \n`;
    explains = `**翻译:**  \n${res.basic.explains ? res.basic.explains.join("  \n") : "无"}  \n`;
  }

  if (res.web) {
    for (let i = 0; i < res.web.length; i++) {
      webTrans += `  \n${i + 1}: ${res.web[i].key}  \n${res.web[i].value.join(",")}`;
    }
  }
  return content + phonetic + explains + webTrans + machineTrans + footer;
}

// 替换文本
function replaceText() {
  // 替换文本
  // editor.edit((eb) => {
  //   eb.replace(new vscode.Range(0, 0, 0, 0), `"文本"`);
  // });
}

// 插入文本
function insertText() {
  // 插入文本
  // editor.edit((eb) => {
  //   eb.insert(editor.document.positionAt(0), `"文本"`);
  // });
}

// 通过 webview 显示内容
function showWebView() {
  // Create a webview panel
  const panel = vscode.window.createWebviewPanel("markdownPreview", "Markdown Preview", vscode.ViewColumn.Two, {});

  // Create a Markdown string with custom text color
  const markdown = new vscode.MarkdownString("**Text:**\n\n");
  markdown.appendMarkdown("\n\n");
  markdown.appendMarkdown("<span style=\"color:red\">Custom Text Color</span>");

  // Set the HTML content of the webview panel
  panel.webview.html = markdown.value;
}

//执行命令
function executeCommand() {
  // 命令都是返回一个类似于Promise的Thenable对象，如果发现api里面返回的是这个对象，说明这个方法不是直接返回结果的。
  vscode.commands.executeCommand("test-command", "editorCommand").then(result => {
    console.log("命令结果", result);
  });

  // 如何在VS代码中打开新文件夹的示例
  let uri = vscode.Uri.file("/some/path/to/folder");
  vscode.commands.executeCommand("vscode.openFolder", uri).then(success => {
    console.log(success);
  });
}

// 获取所有命令
function getCommands() {
  vscode.commands.getCommands().then(allCommands => {
    console.log("所有命令：", allCommands);
  });
}

// 当扩展禁用时触发
export function deactivate() {}
