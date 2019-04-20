import { IOfType } from '~/types';

export interface ILoadOpts {
  file?: string;
  directory?: string;
}

export interface ILoad {
  file?: string;
  pkg?: IOfType<any>;
  directory: string;
}
