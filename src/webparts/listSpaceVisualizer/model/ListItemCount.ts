import {  List, ODataEntity } from "sp-pnp-js";
import { logProperty } from "../utils/Decorators";

export class ListItemCount extends List {

  public static Fields = ["Id", "Title", "ProductNumber", "OrderDate", "OrderAmount"];

  @logProperty
  public ItemCount: number;

  // override get to enfore select for our fields to always optimize
  // but allow it to be overridden by any supplied values
  public get(): Promise<ListItemCount> {
    // use apply and call to manipulate the request into the form we want
    // if another select isn't in place, let's default to only ever getting our fields.
    const query = this._query.getKeys().indexOf("$select") > -1 ? this : this.select.apply(this, ListItemCount.Fields);
    // call the base get, but in our case pass the appropriate ODataEntity def so we are returning
    // a MyItem instance
    return super.get.call(query, ODataEntity(ListItemCount), arguments[1] || {});
  }
}


