import { IBlockProps } from '@/shared/lib/block/interfaces';
import { IFindUserResponse } from '@/entities/user/models/interfaces/find-user';

export interface IProps extends IBlockProps {
  user: IFindUserResponse;
  isSelected: boolean;
  onUserSelect: (user: IFindUserResponse) => void;
  onUserDeselect: (user: IFindUserResponse) => void;
}
