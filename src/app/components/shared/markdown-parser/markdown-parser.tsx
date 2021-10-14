import * as React from "react";
import { useUnmount } from "react-use";
// @ts-ignore
import { renderMarkdown } from "monaco-editor/esm/vs/base/browser/markdownRenderer";
import { Typography } from "@material-ui/core";

// changes with monaco api
type MarkdownType = {
  dispose: () => void;
  element: HTMLDivElement;
};

type Props = {
  readmeContent: string;
};

function MarkdownParser({ readmeContent }: Props) {
  let parsedReadme: MarkdownType;

  try {
    parsedReadme = renderMarkdown({
      value: readmeContent,
    });
  } catch (e: any) {
    window.api.logger.warn(`Error while parsing the readme contents: ${e}`);
  }

  useUnmount(() => parsedReadme?.dispose());

  return parsedReadme ? (
    <div dangerouslySetInnerHTML={{ __html: parsedReadme.element.innerHTML }} />
  ) : (
    <Typography color="textSecondary">
      An error occurred while parsing the project description.
    </Typography>
  );
}

export default MarkdownParser;
