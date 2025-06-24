import { TMerge } from '@/shared/utils/merge/types';

function merge(lhs: TMerge, rhs: TMerge): TMerge {
  for (const key in rhs) {
    if (!rhs.hasOwnProperty(key)) {
      continue;
    }

    const rightValue = rhs[key];
    const leftValue = lhs[key];

    if (rightValue && typeof rightValue === 'object' && !Array.isArray(rightValue)) {
      lhs[key] = merge((leftValue as TMerge) || {}, rightValue as TMerge);
    } else {
      lhs[key] = rightValue;
    }
  }

  return lhs;
}

export default merge;
