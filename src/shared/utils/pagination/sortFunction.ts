import { SortOrder } from 'mongoose';

const sortFunction = (sortBy: string, sortOrder: SortOrder) => {
  const sortOptions: { [key: string]: SortOrder } = {
    [sortBy as string]: sortOrder === 'asc' ? 1 : -1,
  };
  return sortOptions;
};

export default sortFunction;
