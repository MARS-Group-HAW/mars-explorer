import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@material-ui/core";
import { IModelFile } from "@shared/types/Model";
// @ts-ignore
import { renderMarkdown } from "monaco-editor/esm/vs/base/browser/markdownRenderer";

type Props = {
  readme: IModelFile;
  onClose: () => void;
};

function ExampleProjectInfoDialog({ readme, onClose }: Props) {
  let parsedReadme;

  try {
    parsedReadme = renderMarkdown({
      value: readme.content,
    });
  } catch (e: any) {
    window.api.logger.warn(`Error while parsing the readme contents: ${e}`);
  }

  return (
    <Dialog open onClose={onClose} scroll="paper">
      <DialogContent>
        {parsedReadme ? (
          <div dangerouslySetInnerHTML={{ __html: parsedReadme.innerHTML }} />
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
    </Dialog>
  );
}

export default ExampleProjectInfoDialog;
