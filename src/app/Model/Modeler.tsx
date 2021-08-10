import * as React from "react";
import { Component, RefObject } from "react";
import { Channel } from "@shared/types/Channel";
import { Project } from "@shared/types/Project";
import { ExampleProject } from "@shared/types/ExampleProject";
import { Loading } from "../shared/types/Loading";
import { Empty } from "../shared/types/utils";
import Editor from "./Editor";

class Modeler extends Component<Loading, Empty> {
  container: RefObject<HTMLDivElement>;

  constructor(props: Loading) {
    super(props);
    this.container = React.createRef();
  }

  async componentDidMount() {
    const exampleProject = await window.api.invoke<ExampleProject, Project>(
      Channel.GET_EXAMPLE_PROJECT,
      "MyTestApp"
    );

    await this.setupMonaco(exampleProject);
  }

  private async setupMonaco(project: Project) {
    // FIXME: get example path from main
    const fileContents = await window.api.invoke<string, string>(
      Channel.READ_FILE,
      project.entryFilePath
    );

    const { setLoading } = this.props;

    await Editor.create(this.container.current, project, fileContents);
    setLoading(false);
  }

  render() {
    return (
      <div ref={this.container} style={{ height: "100%", width: "100%" }} />
    );
  }
}

export default Modeler;
