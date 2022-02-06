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

  vscode.languages.registerHoverProvider("*", {
    async provideHover(document, position, token) {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return; // No open text editor
      }
      const selection = editor.selection;
      const text = document.getText(selection);

      // Insert header
      // editor.edit((eb) => {
      //   eb.insert(editor.document.positionAt(0), `"文本"`);
      // });

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
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("sayHello", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from fanyi!");
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

// 请求翻译
function translation(text: string) {
  let query = querystring
    .escape(text)
    .replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
    .toLowerCase();
  // 1.用于请求的选项
  let options = {
    host: "fanyi.youdao.com",
    port: "80",
    path:
      "/openapi.do?keyfrom=translation-tool&key=1730699468&type=data&doctype=json&version=1.1&q=" +
      query
  };

  // let options = ` http://aidemo.youdao.com/trans?q=${query}&&from=Auto&&to=Auto`;

  return new Promise((resolve, reject) => {
    // 处理响应的回调函数
    function callback(response: any) {
      response.setEncoding("utf-8");
      // 不断更新数据
      response.on("data", function (data: any) {
        let result = JSON.parse(data);
        resolve(result);
      });
      response.on("end", function () {
        console.log("---------------- by 前端超人 ----------------");
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
    phonetic,
    explains,
    webTrans = "**网络释义:**",
    machineTrans = `  \n**机器翻译:** ${res.translation || ""}  \n`;

  if (res.basic) {
    phonetic = `**发音:** ${res.basic ? res.basic.phonetic : "无"}  \n`;
    explains = `**翻译:**  \n${
      res.basic ? res.basic.explains.join("  \n") : "无"
    }  \n`;
  }

  if (res.web) {
    for (let i = 0; i < res.web.length; i++) {
      webTrans += `  \n${i + 1}: ${res.web[i].key}  \n${res.web[i].value.join(
        ","
      )}`;
    }
  }
  return content + phonetic + explains + webTrans + machineTrans;
}
