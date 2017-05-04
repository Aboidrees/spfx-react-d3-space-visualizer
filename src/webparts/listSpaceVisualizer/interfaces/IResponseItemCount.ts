export interface IResponseItemCount {
  ItemCount: number;
}
export class ResponseItemCount implements IResponseItemCount {
  constructor(
    public ItemCount: number
  ) {};
}


