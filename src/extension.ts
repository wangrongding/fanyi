// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
const querystring = require("querystring");
const http = require("http");
const { axios } = require("./request.ts");
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
      // ================
      // let content = formatText(res);
      // ================
      // let content = `\n------------------------------------------\n 🚀 翻译: ${res} \n---------------- by 前端超人-荣顶 ----------------`;
      let content =
        "-----------------------------------------  \n" +
        "🚀 翻译：  \n" +
        res +
        "  \n-----------------------------------------";
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
  console.log(querystring.unescape(text));

  // let query = querystring.escape(
  //   text
  //     .replace(/([A-Z])/g, " $1")
  //     .replace(/-/g, " ")
  //     .toLowerCase()
  // );
  let query = querystring.unescape(
    text
      .replace(/([A-Z])/g, " $1")
      .replace(/-/g, " ")
      .toLowerCase()
  );

  let options = `http://aidemo.youdao.com/trans?q=${query}&&from=Auto&&to=Auto`;

  return new Promise((resolve, reject) => {
    // // 处理响应的回调函数
    // function callback(response: any) {
    //   response.setEncoding("utf-8");
    //   // 不断更新数据
    //   response.on("data", function (data: any) {
    //     let result = JSON.parse(data);
    //     // console.log("🚀🚀🚀 / result", result);
    //     resolve(result);
    //   });
    //   response.on("end", function () {
    //     // console.log("---------------- by 前端超人 ----------------");
    //   });
    // }
    // // 向服务端发送请求
    // let req = http.request(options, callback);
    // req.end();
    // ================================================================
    /* 
    post("http://47.95.239.198:9521/translate", {
      data: { text: queryStr, source_lang: "auto", target_lang: "ZH" },
    })*/
    /* eslint-disable */
    // const postData = JSON.stringify({
    //   text: query,
    //   source_lang: "auto",
    //   target_lang: "ZH",
    // });
    // // DeepL API
    // let options = {
    //   protocol: "http:",
    //   hostname: "47.95.239.198",
    //   port: 9521,
    //   path: "/translate",
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Content-Length": Buffer.byteLength(postData),
    //   },
    // };
    // // 创建请求
    // const req = http.request(options, (res: any) => {
    //   res.setEncoding("utf8");
    //   res.on("data", (chunk: any) => {
    //     console.log(`BODY: ${chunk}`);
    //   });
    //   res.on("end", () => {
    //     console.log("---------------- by 前端超人 ----------------");
    //   });
    // });
    // req.on("error", (e: any) => {
    //   console.error(`problem with request: ${e.message}`);
    // });
    // // Write data to request body
    // req.write(postData);
    // req.end();
    //===================================
    console.log("🚀🚀🚀 / query", query);
    axios
      .post("http://47.95.239.198:9521/translate", {
        data: { text: query, source_lang: "auto", target_lang: "ZH" },
      })
      .then((res: any) => {
        if (res.code === 200) {
          console.log(`${"🚀🚀🚀 翻译: "}${querystring.unescape(res.data)}`);
          resolve(res.data);
        }
      });
  });
}
// 格式化翻译结果
function formatText(res: any) {
  let content = "### 翻译：\n",
    phonetic = "**发音:**  \n",
    explains = "**翻译:**  \n",
    webTrans = "**网络释义:**",
    machineTrans = `  \n**机器翻译:** ${res.translation || ""}  \n`,
    footer = "  \n---------------- by 前端超人-荣顶 ----------------";

  if (res.basic) {
    phonetic = `**发音:** ${
      res.basic.phonetic ? "[ " + res.basic.phonetic + " ]" : "无"
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

// // 插入文本;
// editor.edit((eb) => {
//   eb.insert(editor.document.positionAt(0), `"文本"`);
// });
