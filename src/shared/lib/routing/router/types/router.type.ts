import { IBlockProps } from '@/shared/lib/block/interfaces';
import Block from '@/shared/lib/block/block';

export type TRouter = new (props: IBlockProps) => Block;
