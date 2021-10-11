import monaco from "@app/standalone/monaco-editor/monaco";
import { editor, IRange } from "monaco-editor";
import { useLatest, useMount } from "react-use";
import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import FindMatch = editor.FindMatch;
import ITextModel = editor.ITextModel;
import IModelDeltaDecoration = editor.IModelDeltaDecoration;

const initColor = "rgb(119, 170, 91)";
const runColor = "rgb(255,162,11)";

const useStyles = makeStyles(() => ({
  initLineDecoration: {
    backgroundColor: initColor,
  },
  initTextDecoration: {
    color: `${initColor} !important`,
    fontWeight: "bold",
  },
  runLineDecoration: {
    backgroundColor: runColor,
  },
  runTextDecoration: {
    color: `${runColor} !important`,
    fontWeight: "bold",
  },
}));

enum Category {
  INPUT,
  RUN,
}

type CategoryKeywords = {
  category: Category;
  keywordRegex: string;
  hoverMessage: string;
};

const categoryKeywords: CategoryKeywords[] = [
  {
    category: Category.INPUT,
    keywordRegex: "(\\[PropertyDescription\\])|(Init\\(.*\\))",
    hoverMessage: "This line is part of the **Input** process",
  },
  {
    category: Category.RUN,
    keywordRegex: "(Tick\\(.*\\))",
    hoverMessage: "This line is part of the **Model Execution** process",
  },
];

function useEditorDecorations() {
  const classes = useStyles();
  const [decorationIds, setDecorationIds] = useState([]);
  const latestDecorationIds = useLatest(decorationIds);

  const decorate = (model: ITextModel, editedRange?: IRange[]) => {
    const rangesOfCurrentDecorations: IRange[] =
      latestDecorationIds.current.map((decId) =>
        model.getDecorationRange(decId)
      );

    const deltaDecorations: IModelDeltaDecoration[] = categoryKeywords
      .map((category) => {
        const matches: FindMatch[] = model.findMatches(
          category.keywordRegex,
          rangesOfCurrentDecorations.concat(editedRange),
          true,
          true,
          null,
          false
        );

        const isInputCategory = category.category === Category.INPUT;

        return matches.map((match) => ({
          range: match.range,
          options: {
            linesDecorationsClassName: isInputCategory
              ? classes.initLineDecoration
              : classes.runLineDecoration,
            inlineClassName: isInputCategory
              ? classes.initTextDecoration
              : classes.runTextDecoration,
            hoverMessage: { value: category.hoverMessage },
          },
        }));
      })
      .flat();

    const decorations = model.deltaDecorations(
      latestDecorationIds.current,
      deltaDecorations
    );

    setDecorationIds(decorations);
  };

  useMount(() => {
    const dispose = monaco.editor.onDidCreateModel((model) => {
      decorate(model);
      return model.onDidChangeContent((e) =>
        decorate(
          model,
          e.changes.map((change) => ({
            ...change.range,
            endColumn: change.range.endColumn + 1,
            startColumn: 1,
          }))
        )
      );
    });

    return () => dispose.dispose();
  });
}

export default useEditorDecorations;
