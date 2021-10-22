import {editor, Uri} from "monaco-editor";

// workaround for windows because drive letter will be lower case in monaco
function uriToFsPath(uri: Uri): string {
    const modelPath = uri.fsPath;
    return modelPath?.charAt(0).toUpperCase() + modelPath.slice(1);
}

export default uriToFsPath;
