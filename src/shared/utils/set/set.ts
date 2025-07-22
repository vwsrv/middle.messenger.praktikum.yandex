import { TMerge } from '@/shared/utils/merge/types';
import { TSet } from '@/shared/utils/set/types/set.type.ts';
import merge from '@/shared/utils/merge/merge.ts';

function set(args: TSet): TMerge | unknown {
  if (typeof args.object !== 'object' || args.object === null) {
    return args.object;
  }

  const result = args.path.split('.').reduceRight<TMerge>(
    (acc, key) => ({
      [key]: acc,
    }),
    args.value as any,
  );
  return merge(args.object as TMerge, result);
}

export default set;
/**
 * set({ foo: 5 }, 'bar.baz', 10); // { foo: 5, bar: { baz: 10 } }
 * set(3, 'foo.bar', 'baz'); // 3
 */
