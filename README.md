## react-d3-space-visualizer
This is an example of usage D3 Treemap library on SPFx.

## Features
- Service Scope: 
  - https://dev.office.com/sharepoint/reference/spfx/sp-core-library/servicescope
  - https://github.com/SharePoint/sp-dev-docs/wiki/Tech-Note:-ServiceScope-API
- Asycn / Await in batches: 
  - http://www.vrdmn.com/2017/04/using-typescript-asyncawait-to-simplify.html

## Get SP File sizes
- Rest API
  - https://msdn.microsoft.com/en-us/library/office/dn450841.aspx#bk_FileProperties length property
- PnP JS
  - Working with Files: https://github.com/SharePoint/PnP-JS-Core/wiki/Working-With:-Files


  
This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
