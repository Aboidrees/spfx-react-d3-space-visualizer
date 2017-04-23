import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'listSpaceVisualizerStrings';
import ListSpaceVisualizer from './components/ListSpaceVisualizer';
import { IListSpaceVisualizerProps } from './components/IListSpaceVisualizerProps';
import { IListSpaceVisualizerWebPartProps } from './IListSpaceVisualizerWebPartProps';

export default class ListSpaceVisualizerWebPart extends BaseClientSideWebPart<IListSpaceVisualizerWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IListSpaceVisualizerProps > = React.createElement(
      ListSpaceVisualizer,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
