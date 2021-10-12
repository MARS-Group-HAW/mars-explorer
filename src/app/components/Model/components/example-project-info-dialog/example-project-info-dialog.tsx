import * as React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@material-ui/core";
import { IModelFile } from "@shared/types/Model";
// @ts-ignore
import { renderMarkdown } from "monaco-editor/esm/vs/base/browser/markdownRenderer";
import { useUnmount } from "react-use";
import DialogWithKeyListener from "../../../shared/dialog-with-key-listener";

// changes with monaco api
type MarkdownType = {
  dispose: () => void;
  element: HTMLDivElement;
};

type Props = {
  readme: IModelFile;
  onClose: () => void;
};

function ExampleProjectInfoDialog({ readme, onClose }: Props) {
  let parsedReadme: MarkdownType;

  try {
    parsedReadme = renderMarkdown({
      value: readme.content,
    });
  } catch (e: any) {
    window.api.logger.warn(`Error while parsing the readme contents: ${e}`);
  }

  useUnmount(() => parsedReadme.dispose());

  return (
    <DialogWithKeyListener
      open
      onClose={onClose}
      onKeyPressed={onClose}
      scroll="paper"
      maxWidth="md"
    >
      <DialogContent>
        {parsedReadme ? (
          <div
            dangerouslySetInnerHTML={{ __html: parsedReadme.element.innerHTML }}
          />
        ) : (
          <Typography color="textSecondary">
            An error occurred while parsing the project description.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </DialogWithKeyListener>
  );
}

export default ExampleProjectInfoDialog;
