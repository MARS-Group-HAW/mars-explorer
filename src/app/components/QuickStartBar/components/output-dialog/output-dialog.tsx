import * as React from "react";
import { useEffect, useMemo } from "react";
import {
  AppBar,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
} from "@material-ui/core";
import DialogWithKeyListener from "../../../shared/dialog-with-key-listener";
import useTabs from "../../../../utils/hooks/use-tabs";
import NoDataMessage from "../../../shared/no-data-message/no-data-message";

type Props = {
  open: boolean;
  onClose: () => void;
  errorMsg: string;
  outputMsg: string;
};

enum TabOptions {
  OUTPUT,
  ERROR,
}

let msgKeys = 1;

function OutputDialog({ open, errorMsg, outputMsg, onClose }: Props) {
  const [tab, setTab] = useTabs(TabOptions.OUTPUT);

  useEffect(() => {
    if (errorMsg) {
      setTab(TabOptions.ERROR);
      return;
    }
    if (outputMsg) {
      setTab(TabOptions.OUTPUT);
    }
  }, [errorMsg, outputMsg]);

  const errorContent = useMemo(
    () =>
      errorMsg ? (
        <>
          {errorMsg.split("\n").map((msg) => (
            <DialogContentText
              key={msgKeys++}
              tabIndex={-1}
              style={{ fontFamily: "monospace", color: "red" }}
            >
              {msg}
            </DialogContentText>
          ))}
        </>
      ) : (
        <NoDataMessage msg="No error output found." />
      ),
    [errorMsg]
  );

  const outputContent = useMemo(
    () =>
      outputMsg ? (
        <>
          {outputMsg.split("\n").map((msg) => (
            <DialogContentText
              key={msgKeys++}
              tabIndex={-1}
              style={{ fontFamily: "monospace" }}
            >
              {msg}
            </DialogContentText>
          ))}
        </>
      ) : (
        <NoDataMessage msg="No console output found." />
      ),
    [outputMsg]
  );

  return (
    <DialogWithKeyListener
      open={open}
      onKeyPressed={onClose}
      scroll="paper"
      maxWidth="lg"
      PaperProps={{ style: { height: "80%", minWidth: "90%" } }}
    >
      <DialogTitle id="scroll-dialog-title">Simulation Output</DialogTitle>
      <AppBar position="static">
        <Tabs
          value={tab}
          onChange={(_, newValue: TabOptions) => setTab(newValue)}
          centered
        >
          <Tab label="Console" value={TabOptions.OUTPUT} />
          <Tab label="Error" value={TabOptions.ERROR} />
        </Tabs>
      </AppBar>
      <DialogContent dividers>
        {tab === TabOptions.ERROR ? errorContent : outputContent}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </DialogWithKeyListener>
  );
}

export default OutputDialog;
