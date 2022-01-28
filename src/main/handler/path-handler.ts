import { Channel } from "@shared/types/Channel";
import path from "path";
import { fileURLToPath } from "url";
import appPaths from "../app-paths";
import IpcHandler from "./ipc-handler";

class PathHandler extends IpcHandler {
  protected registerHandler(): void {
    this.handle(Channel.GET_WORKSPACE_PATH, () => this.handleWorkspacePath());
    this.handle(Channel.GET_EXAMPLES_PATH, () => this.handleExamplesPath());
    this.handle(Channel.URI_TO_NAME, (_, uri) => this.handleUriToName(uri));
    this.handle(Channel.PATH_ABSOLUTE_TO_RELATIVE, (_, paths) =>
      this.handleAbsoluteToRelativePath(paths)
    );
  }

  private handleWorkspacePath = () => appPaths.workspaceDir;

  private handleExamplesPath = () => appPaths.resourcesExamplesDir;

  private handleUriToName = (uri: string) => path.basename(fileURLToPath(uri));

  private handleAbsoluteToRelativePath = ({
    from,
    to,
  }: {
    from: string;
    to: string;
  }) => path.relative(from, to);
}

export default new PathHandler();
