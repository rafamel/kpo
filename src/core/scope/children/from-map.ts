import { IOfType } from '~/types';
import { IChild } from '../../types';
import { absolute } from '~/utils/file';

export default function getChildrenFromMap(
  map: IOfType<string>,
  directory: string
): IChild[] {
  return Object.entries(map).map(([key, value]) => ({
    directory: absolute({ path: value, cwd: directory }),
    matcher(name: string): boolean {
      return name === key;
    }
  }));
}
