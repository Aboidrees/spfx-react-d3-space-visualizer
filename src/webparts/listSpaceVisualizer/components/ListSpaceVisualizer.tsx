import * as React from 'react';
import styles from './ListSpaceVisualizer.module.scss';

// import interfaces
import { IFile, IResponseFile, IResponseItem, IResponseFolder, IResponseItemCount } from "../interfaces";

// import model
import { ListItemCount } from "../model/ListItemCount";

// import pnp and pnp logging system
import pnp, { Logger, FunctionListener, LogEntry, LogLevel } from "sp-pnp-js";
// import SPFx Logging system
import { Log } from "@microsoft/sp-core-library";


import { data } from "../data/mockData";
import TreeMap from "react-d3-treemap";
// Include its styles in you build process as well
import "react-d3-treemap/dist/react.d3.treemap.css";
import ContainerDimensions from 'react-container-dimensions';

// import React props and state
import { IListSpaceVisualizerProps } from './IListSpaceVisualizerProps';
import { IListSpaceVisualizerState } from './IListSpaceVisualizerState';


export default class ListSpaceVisualizer extends React.Component<IListSpaceVisualizerProps, IListSpaceVisualizerState> {

  constructor(props: IListSpaceVisualizerProps) {
    super(props);
    // set initial state
    this.state = {
      items: [],
      errors: []
    };

    // normally we don't need to bind the functions as we use arrow functions and do automatically the bing
    // http://bit.ly/reactArrowFunction
    // but using Async function we can't convert it into arrow function, so we do the binding here
    this._readAllFilesSize.bind(this);

    // enable PnP JS Logging integrated with SPFx Logging
    this._enableLogging();
  }

  public componentDidMount(): void {
    const libraryName: string = "Documents";
    console.log("libraryName: " + libraryName);
    this._readAllFilesSize(libraryName);
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
        <div>
          {
            this.state.errors.length > 0
              ? this.state.errors.map(item => <div>{item.toString()}</div>)
              : null
          }
        </div>
      </div>
    );
  }


  private async _pnpjsGetItemCount<T>(libraryName: string, selects: string): Promise<any> {
    debugger;
    return pnp.sp.web.lists.as(ListItemCount).get();
      // .getByTitle(libraryName)
      // .select(selects)
      // .get();
  }

  // try that https://github.com/SharePoint/PnP-JS-Core/wiki/Extending-with-Custom-Business-Objects
  private async _pnpjs_GetAllItems<T>(libraryName: string, selects: string): Promise<T> {
    return pnp.sp.web.lists.getByTitle(libraryName)
      .items
      .select(selects)
      .expand("File/Length")
      .get();
  }

  // async functions were introduced with ES3/ES5 native support in TypeScript 2.1
  // https://blogs.msdn.microsoft.com/typescript/2016/12/07/announcing-typescript-2-1/
  // async function always return a Promise, on this scenario we return void Promise
  //   because we will not need it as we are directly setting the Component´s state
  private async _readAllFilesSize(libraryName: string): Promise<void> {

    // let a: ListItemCount = new ListItemCount();
    // console.log(a);
    // debugger;

    console.log("_readAllFilesSize");
    try {
      // query Item Count for the Library
      const selectsPropsObject: IResponseItemCount = { ItemCount: null };
      const selectsString: string = Object.keys(selectsPropsObject).join(",");
      const responseItemCount: IResponseItemCount = await this._pnpjsGetItemCount<IResponseItemCount>(libraryName, selectsString);
      const itemCount: number = responseItemCount.ItemCount;
      console.log("itemCount: " + itemCount);

      // we will follow two strategies:
      //  small libraries: get all the items and build the hierarchy object
      //  big libraries: query by folders
      if (itemCount > 5) {
        // big Libraries

      } else {
        const response: IResponseFile[] = await pnp.sp.web.lists
          .getByTitle(libraryName)
          .rootFolder
          .files
          .select("Name", "Length")
          .get();
        const items: IFile[] = response.map((item: IResponseFile) => {
          return {
            // Title: item.Title,
            // Size: item.File.Length,
            Name: item.Name,
            Size: item.Length
          };
        });

        const responseFolders: IResponseFolder[] = await pnp.sp.web.lists
          .getByTitle(libraryName)
          .rootFolder
          .folders
          .get();
        debugger;
        // if the folder has some documents then call again
        responseFolders.forEach((item: IResponseFolder) => {
          return {
            Name: item.Name,
          };
        });

        // Set our Component´s State
        this.setState({ ...this.state, items });
      }

    } catch (error) {
      // set a new state conserving the previous state + the new error
      console.error(error);
      this.setState({
        ...this.state,
        errors: [...this.state.errors, "Error getting ItemCount for " + libraryName + ". Error: " + error]
      });
    }
  }


  private _enableLogging() {
    ////////////////////////////////////////////////////////////////////////
    // enable Logging system
    ////////////////////////////////////////////////////////////////////////
    // we will integrate PnP JS Logging System with SPFx Logging system
    // 1. Logger object => PnP JS Logger
    //    https://github.com/SharePoint/PnP-JS-Core/wiki/Working-With:-Logging
    // 2. Log object => SPFx Logger
    //    https://github.com/SharePoint/sp-dev-docs/wiki/Working-with-the-Logging-API
    ////////////////////////////////////////////////////////////////////////
    // [PnP JS Logging] activate Info level
    Logger.activeLogLevel = LogLevel.Info;
    // [PnP JS Logging] create a custom FunctionListener to integrate PnP JS and SPFx Logging systems
    let listener = new FunctionListener((entry: LogEntry) => {
      // get React component name
      const componentName: string = (this as any)._reactInternalInstance._currentElement.type.name;
      // mapping betwween PnP JS Log types and SPFx logging methods
      // instead of using switch we use object easy syntax
      const logLevelConversion = { Verbose: "verbose", Info: "info", Warning: "warn", Error: "error" };
      // create Message. Two importante notes here:
      // 1. Use JSON.stringify to output everything. It´s helpful when some internal exception comes thru.
      // 2. Use JavaScript´s Error constructor allows us to output more than 100 characters using SPFx logging
      const formatedMessage: Error = new Error(`Message: ${entry.message} Data: ${JSON.stringify(entry.data)}`);
      // [SPFx Logging] Calculate method to invoke verbose, info, warn or error
      const method = logLevelConversion[LogLevel[entry.level]];
      // [SPFx Logging] Call SPFx Logging system with the message received from PnP JS Logging
      Log[method](componentName, formatedMessage);
    });
    // [PnP JS Logging] Once create the custom listerner we should subscribe to it
    Logger.subscribe(listener);
  }

};
