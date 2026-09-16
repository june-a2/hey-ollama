import * as vscode from "vscode";

type ollamaResponse = {
  message?: {
    content?: string;
  };
};

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "hey-ollama.ask",
    async () => {
      const prompt = await vscode.window.showInputBox({
        prompt: "ask your local ai agent",
        placeHolder:
          "explain this file, help fix an error, or write a function",
      });

      if (!prompt?.trim()) {
        return;
      }

      const editor = vscode.window.activeTextEditor;
      const filecontext = editor
        ? `\n\nactive file: ${editor.document.fileName}\n\`\`\`${editor.document.languageId}\n${editor.document.getText().slice(0, 16000)}\n\`\`\``
        : "";

      try {
        const answer = await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "hey ollama is thinking",
          },
          async () => {
            const response = await fetch("http://127.0.0.1:11434/api/chat", {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                model: "qwen2.5-coder:7b",
                stream: false,
                messages: [
                  {
                    role: "system",
                    content:
                      "you are a helpful local coding assistant. explain your reasoning clearly and do not claim to edit files.",
                  },
                  {
                    role: "user",
                    content: `${prompt}${filecontext}`,
                  },
                ],
              }),
            });

            if (!response.ok) {
              throw new Error(
                `ollama returned ${response.status}: ${await response.text()}`,
              );
            }

            const data = (await response.json()) as ollamaResponse;
            const content = data.message?.content?.trim();

            if (!content) {
              throw new Error("ollama returned an empty response");
            }

            return content;
          },
        );

        const document = await vscode.workspace.openTextDocument({
          content: answer,
          language: "markdown",
        });

        await vscode.window.showTextDocument(document, {
          preview: true,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "unknown error";
        void vscode.window.showErrorMessage(
          `could not reach ollama: ${message}`,
        );
      }
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
