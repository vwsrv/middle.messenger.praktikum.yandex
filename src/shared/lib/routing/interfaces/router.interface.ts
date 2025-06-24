export interface IRouting {
  render: () => void;
  match: (url: string) => boolean;
  leave: () => void;
}
