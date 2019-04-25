import { IScripts, IOfType } from '~/types';

export interface IPaths {
  kpo: string | null;
  pkg: string | null;
  directory: string;
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
