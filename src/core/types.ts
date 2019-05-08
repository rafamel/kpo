import { IScripts, IOfType, TScript, IScopeOptions } from '~/types';

export interface IPaths {
  pkg: string | null;
  kpo: string | null;
  directory: string;
}

export interface ILoaded {
  kpo: IScripts | null;
  pkg: IOfType<any> | null;
  options: IScopeOptions;
}

export interface IChild {
  name: string;
  directory: string;
}

export interface ITask {
  path: string;
  hidden: boolean;
  script: TScript | TScript[];
  description?: string;
}

export interface ITasks {
  kpo?: ITask[];
  pkg?: ITask[];
}
