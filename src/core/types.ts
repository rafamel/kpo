import { IScripts, IOfType, TScript } from '~/types';

export interface IPaths {
  kpo: string | null;
  pkg: string | null;
  directory: string;
}

export interface ILoaded {
  kpo: IScripts | null;
  pkg: IOfType<any> | null;
}

export interface IScope {
  name: string;
  directory: string;
}

export interface IChild {
  directory: string;
  matcher: (scope: string) => boolean;
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
