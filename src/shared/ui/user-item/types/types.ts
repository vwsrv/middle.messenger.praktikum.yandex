import { IBlockProps } from '@/shared/lib/block/interfaces';
import { IFindUserResponse } from '@/entities/user/models/interfaces/find-user';

export interface IUserItemProps extends IBlockProps, IFindUserResponse {
  isSelected?: boolean;
  onClick?: (user: IUserItemProps) => void;
}

export interface IProps extends IBlockProps {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar?: string;
  isSelected: boolean;
  onSelect: () => void;
}
