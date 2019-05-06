import read from 'read-pkg-up';
import cache from '~/utils/cache';
import { IOfType } from '~/types';
import errors from '~/utils/errors';

export default cache(
  null,
  (): IOfType<any> => {
    try {
      return read.sync({ cwd: __dirname }).pkg;
    } catch (e) {
      throw new errors.CustomError(`Package couldn't be retrieved`, null, e);
    }
  }
);
