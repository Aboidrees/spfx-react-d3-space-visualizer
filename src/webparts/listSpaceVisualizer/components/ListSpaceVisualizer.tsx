import * as React from 'react';
import styles from './ListSpaceVisualizer.module.scss';

import { escape } from '@microsoft/sp-lodash-subset';
import { data } from "../data/mockData";
import TreeMap from "react-d3-treemap";
// Include its styles in you build process as well
import "react-d3-treemap/dist/react.d3.treemap.css";
import ContainerDimensions from 'react-container-dimensions';

import pnp, { Logger, FunctionListener, LogEntry, LogLevel } from "sp-pnp-js";
import { Log } from "@microsoft/sp-core-library";

import { IListSpaceVisualizerProps } from './IListSpaceVisualizerProps';
import { IListSpaceVisualizerState } from './IListSpaceVisualizerState';

interface IResponseFile {
  Length: number;
}
interface IResponseItem {
  File: IResponseFile;
  FileLeafRef: string;
  Title: string;
}
interface IFile {
  Title: string;
  Name: string;
  Size: number;
}

export default class ListSpaceVisualizer extends React.Component<IListSpaceVisualizerProps, IListSpaceVisualizerState> {


  constructor(props: IListSpaceVisualizerProps) {
    super(props);
    // set initial state
    this.state = {
      items: []
    };

    this.readAllFilesSize.bind(this);

    // pnp-js Logger. set the active log level
    Logger.activeLogLevel = LogLevel.Info;
    // https://github.com/SharePoint/PnP-JS-Core/wiki/Working-With:-Logging
    // pnp-js Logger. subscribe a listener
    // Logger.subscribe(new ConsoleListener());
    // pnp-js Logger. subscribe a custom listener integrated with SPFx Logging system
    let listener = new FunctionListener((entry: LogEntry) => {
      const componentName: string = (this as any)._reactInternalInstance._currentElement.type.name;
      const logLevelConversion = { Verbose: "verbose", Info: "info", Warning: "warn", Error: "error" };
      const formatedMessage: string = `Message: ${entry.message} Data: ${JSON.stringify(entry.data)}`;
      Log[logLevelConversion[LogLevel[entry.level]]](componentName, new Error(formatedMessage));
    });
    Logger.subscribe(listener);
  }

  public componentDidMount(): void {
    // this.readItems();
    this.readAllFilesSize("Documents");
  }

  public render(): React.ReactElement<IListSpaceVisualizerProps> {
    return (
      <div>
        {/*<ContainerDimensions>
          {({ width, height }) =>
            <TreeMap
              width={width - 20}
              height={600}
              data={data}
              valueUnit={"MB"}
            />
          }
        </ContainerDimensions>*/}
        {this.state.items.map((item) => {
          return (
            <div>{item.Name}: {item.Size}</div>
          );
        })}
      </div>
    );
  }

  private async readAllFilesSize(libraryName: string): Promise<void> {
    try {
      const response: IResponseItem[] = await pnp.sp
        .web
        .lists
        .getByTitle(libraryName)
        .items
        .select("Title", "FileLeafRef", "asdasf")
        .expand("File/Length")
        .get();
      const items: IFile[] = response.map((item: IResponseItem) => {
        return {
          Title: item.Title,
          Size: item.File.Length,
          Name: item.FileLeafRef
        };
      });
      this.setState({ items });
    } catch (error) {
      // throw new Error(error);
      // do something with State
      this.setState({ items: [] });
    }
  }

};
