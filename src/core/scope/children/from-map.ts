import path from 'path';
import { IOfType } from '~/types';
import { IChild } from '../../types';

export default function getChildrenFromMap(
  map: IOfType<string>,
  directory: string
): IChild[] {
  return Object.entries(map).map(([key, value]) => ({
    directory: path.isAbsolute(value) ? value : path.join(directory, value),
    matcher(name: string): boolean {
      return name === key;
    }
  }));
}
