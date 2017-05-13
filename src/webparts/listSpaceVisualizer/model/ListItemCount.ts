import { Lists, ODataEntity } from "sp-pnp-js";
import { select } from "../utils/Decorators";

export class ListItemCount extends Lists {

  @select()
  public Title: string;

  @select()
  public ItemCount: number;

  // @select()
  // public "File/Length": string;

  // override get to enfore select for our fields to always optimize
  // but allow it to be overridden by any supplied values
  public getAs<T>(): Promise<T> {
    // use apply and call to manipulate the request into the form we want
    // if another select isn't in place, let's default to only ever getting our fields.
    const selectList = this[Symbol.for("select")];
    const query = this._query.getKeys().indexOf("$select") > -1 ? this : this.select.call(this, selectList);
    // call the base get, but in our case pass the appropriate ODataEntity def so we are returning
    // a MyItem instance
    return super.get.call(query, ODataEntity(ListItemCount), arguments[1] || {});
  }
}


