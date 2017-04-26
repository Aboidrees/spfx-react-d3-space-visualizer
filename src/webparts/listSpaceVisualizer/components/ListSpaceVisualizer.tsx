import * as React from 'react';
import styles from './ListSpaceVisualizer.module.scss';

import { escape } from '@microsoft/sp-lodash-subset';
import { data } from "../data/mockData";
import TreeMap from "react-d3-treemap";
// Include its styles in you build process as well
import "react-d3-treemap/dist/react.d3.treemap.css";
import ContainerDimensions from 'react-container-dimensions';

import * as pnp from 'sp-pnp-js';


import { IListSpaceVisualizerProps } from './IListSpaceVisualizerProps';
import { IListSpaceVisualizerState } from './IListSpaceVisualizerState';

export default class ListSpaceVisualizer extends React.Component<IListSpaceVisualizerProps, IListSpaceVisualizerState> {


  constructor(props: IListSpaceVisualizerProps) {
    super(props);
    // set initial state
    this.state = {
      items: []
    };
  }

  public componentDidMount(): void {
    this.readItems();
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
        {this.state.items}
      </div>
    )
  }

  private readItems = (): void => {

    // pnp.sp.web.getFileByServerRelativeUrl("/sites/dev/shared documents/file.txt").approve("Approval Comment").then(_ => {
    //     console.log("File approved!");
    // });


    // this.updateStatus('Loading all items...');
    pnp.sp.web.lists.getByTitle("Documents")
      .items
      .select('File/Length')
      .expand('File/Length')
      .get()
      .then((items: any): void => {
        items.forEach((item: any) => {
              console.log(item.File.Length);
        });
        this.setState({ items });
      })
      .catch((error: any): void => {
        console.warn("Loading all items failed with error: " + error);
      });
  }

};
