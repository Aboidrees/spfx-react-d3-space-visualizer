import * as React from 'react';
import styles from './ListSpaceVisualizer.module.scss';
import { IListSpaceVisualizerProps } from './IListSpaceVisualizerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { data } from "../data/mockData";
import TreeMap from "react-d3-treemap";
// Include its styles in you build process as well
import "react-d3-treemap/dist/react.d3.treemap.css";
import ContainerDimensions from 'react-container-dimensions';

export default class ListSpaceVisualizer extends React.Component<IListSpaceVisualizerProps, void> {
  public render(): React.ReactElement<IListSpaceVisualizerProps> {
    debugger;
    return (
      <ContainerDimensions>
        {({ width, height }) =>
          <TreeMap
            width={width - 20}
            height={600}
            data={data}
            valueUnit={"MB"}
          />
        }
      </ContainerDimensions>

    )
  }
};
