import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';
import pnp from "sp-pnp-js";
import * as strings from 'listSpaceVisualizerStrings';
import ListSpaceVisualizer from './components/ListSpaceVisualizer';
import { IListSpaceVisualizerProps } from './components/IListSpaceVisualizerProps';
import { IListSpaceVisualizerWebPartProps } from './IListSpaceVisualizerWebPartProps';

export default class ListSpaceVisualizerWebPart extends BaseClientSideWebPart<IListSpaceVisualizerWebPartProps> {

  // establish SPFx context
  // https://github.com/SharePoint/PnP-JS-Core/wiki/Using-sp-pnp-js-in-SharePoint-Framework
  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      pnp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IListSpaceVisualizerProps> = React.createElement(
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
                PropertyPaneTextField("description", {
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
