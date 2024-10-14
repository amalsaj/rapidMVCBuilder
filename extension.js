const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.generateMVC', async () => {
        const rootPath = vscode.workspace.rootPath;
        if (!rootPath) {
            vscode.window.showErrorMessage('Please open a workspace folder to generate the MVC structure');
            return;
        }

        // Prompt user for server.js file name
        const serverFileName = await vscode.window.showInputBox({
            prompt: 'Enter the name for your server file (e.g., server.js)',
            value: 'server.js',
            placeHolder: 'server.js'
        });

        if (!serverFileName) {
            vscode.window.showErrorMessage('Server file name is required!');
            return;
        }

        // Define folders and file content
        const folders = ['config', 'controller', 'db', 'route', 'utils'];
        const gitignoreContent = `node_modules
.env
`;
        const serverJsContent = `const express = require('express');
const app = express();

// Import routes
const routes = require('./route');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});`;

        // Create folders and files
        try {
            // Create the folders
            folders.forEach(folder => {
                const folderPath = path.join(rootPath, folder);
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                    vscode.window.showInformationMessage(`Folder created: ${folder}`);
                }
            });

            // Create .gitignore
            const gitignorePath = path.join(rootPath, '.gitignore');
            fs.writeFileSync(gitignorePath, gitignoreContent.trim(), 'utf8');
            vscode.window.showInformationMessage('File created: .gitignore');

            // Create the server file with user-provided name
            const serverFilePath = path.join(rootPath, serverFileName);
            fs.writeFileSync(serverFilePath, serverJsContent, 'utf8');
            vscode.window.showInformationMessage(`File created: ${serverFileName}`);

        } catch (err) {
            vscode.window.showErrorMessage(`Error: ${err.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
