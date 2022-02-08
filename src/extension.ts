// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
const querystring = require("querystring");
const http = require("http");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Congratulations,扩展 fanyi 已经激活!");

  //注册hover事件
  vscode.languages.registerHoverProvider("*", {
    provideHover: hoverEvent,
  });
  //hover事件
  async function hoverEvent() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    console.log("🚀🚀🚀 / text", text, selection);
    if (text) {
      let res = (await translation(text)) as any;
      let content = formatText(res);
      const markdownString = new vscode.MarkdownString();
      markdownString.appendMarkdown(content);
      markdownString.supportHtml = true;
      markdownString.isTrusted = true;
      return new vscode.Hover(markdownString);
    }
  }
  async function menuTranslation() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }
    const selection = editor.selection;
    const text = editor.document.getText(selection);
  }

  //注册命令，回调函数接收一个可选参数uri
  let disposable = vscode.commands.registerCommand("sayHello", (uri) => {
    vscode.window.showInformationMessage("当前文件路径:" + uri);
    menuTranslation();
  });
  //文本编辑器命令与普通命令不同，它们仅在有被编辑器被激活时调用才生效，此外，这个命令可以访问到当前活动编辑器textEditor
  let editorCommand = vscode.commands.registerTextEditorCommand(
    "editorCommand",
    (textEditor, edit) => {
      console.log(textEditor, edit);
    }
  );
  context.subscriptions.push(disposable, editorCommand);
}

// 当扩展禁用时触发
export function deactivate() {}

// 获取所有命令
function getCommands() {
  vscode.commands.getCommands().then((allCommands) => {
    console.log("所有命令：", allCommands);
  });
}

//执行命令
function executeCommand() {
  // 命令都是返回一个类似于Promise的Thenable对象，如果发现api里面返回的是这个对象，说明这个方法不是直接返回结果的。
  vscode.commands.executeCommand("sayHello", "editorCommand").then((result) => {
    console.log("命令结果", result);
  });

  // 如何在VS代码中打开新文件夹的示例
  let uri = vscode.Uri.file("/some/path/to/folder");
  vscode.commands.executeCommand("vscode.openFolder", uri).then((success) => {
    console.log(success);
  });
}

// 请求翻译
function translation(text: string) {
  let query = querystring.escape(
    text
      .replace(/([A-Z])/g, " $1")
      .replace(/-/g, " ")
      .toLowerCase()
  );
  // console.log("🚀🚀🚀 / query", query);
  // 1.用于请求的选项
  let options = {
    host: "fanyi.youdao.com",
    port: "80",
    path:
      "/openapi.do?keyfrom=translation-tool&key=1730699468&type=data&doctype=json&version=1.1&q=" +
      query,
  };

  // let options = ` http://aidemo.youdao.com/trans?q=${query}&&from=Auto&&to=Auto`;

  return new Promise((resolve, reject) => {
    // 处理响应的回调函数
    function callback(response: any) {
      response.setEncoding("utf-8");
      // 不断更新数据
      response.on("data", function (data: any) {
        let result = JSON.parse(data);
        // console.log("🚀🚀🚀 / result", result);
        resolve(result);
      });

      response.on("end", function () {
        // console.log("---------------- by 前端超人 ----------------");
      });
    }
    // 向服务端发送请求
    let req = http.request(options, callback);
    req.end();
  });
}
// 格式化翻译结果
function formatText(res: any) {
  let content = "### 翻译：\n",
    phonetic = `**发音:**  \n`,
    explains = `**翻译:**  \n`,
    webTrans = "**网络释义:**",
    machineTrans = `  \n**机器翻译:** ${res.translation || ""}  \n`,
    footer = "  \n---------------- by 前端超人-荣顶 ----------------";

  if (res.basic) {
    phonetic = `**发音:** ${
      res.basic.phonetic ? res.basic.phonetic : "无"
    }  \n`;
    explains = `**翻译:**  \n${
      res.basic.explains ? res.basic.explains.join("  \n") : "无"
    }  \n`;
  }

  if (res.web) {
    for (let i = 0; i < res.web.length; i++) {
      webTrans += `  \n${i + 1}: ${res.web[i].key}  \n${res.web[i].value.join(
        ","
      )}`;
    }
  }
  return content + phonetic + explains + webTrans + machineTrans + footer;
}

/* 

 // 插入文本
      // editor.edit((eb) => {
      //   eb.insert(editor.document.positionAt(0), `"文本"`);
      // });

*/
