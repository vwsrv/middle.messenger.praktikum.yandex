import { TTrim } from '@/shared/utils/trim/types/trim.type.ts';

export const trim = (args: TTrim) => {
  if (!args.chars) {
    return args.str.trim();
  }

  const escaped = args.chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return args.str.replace(new RegExp(`^[${escaped}]+|[${escaped}]+$`, 'g'), '');
};
