import { IScripts, IOfType } from '~/types';

export interface IPathsOpts {
  file?: string;
  directory?: string;
}

export interface IBasePaths {
  kpo: string | null;
  pkg: string | null;
  bin: string[];
  directory: string;
}

export interface IPaths extends IBasePaths {
  root: IBasePaths | null;
  children: IBasePaths[];
}

export interface ILoaded {
  kpo: IScripts | null;
  pkg: IOfType<any> | null;
}

export interface IScopeDefinition {
  names: string[];
  directory: string;
}

export interface IChild {
  directory: string;
  matcher: (scope: string) => boolean;
}
