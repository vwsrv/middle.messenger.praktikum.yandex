import { IBlockProps } from '@/shared/lib/block/interfaces';
import Block from '@/shared/lib/block/block.ts';

export type TBlockConstructor = new (props: IBlockProps) => Block;
