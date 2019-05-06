import pathKey from 'path-key';
import alter from 'manage-path';
import { IOfType } from '~/types';

export default class EnvManager {
  private key: string;
  private env: IOfType<string | undefined>;
  private initial: IOfType<string | undefined>;
  private assigned: IOfType<string | undefined>;
  public constructor(env: IOfType<string | undefined>) {
    this.key = pathKey({ env });
    this.env = env;
    this.initial = Object.assign({}, env);
    this.assigned = {};
  }
  public assign(env: IOfType<string | undefined>): void {
    Object.assign(this.env, env);
    Object.assign(this.assigned, env);
  }
  public addPaths(paths: string[]): void {
    const env = { [this.key]: this.env[this.key] };
    alter(env).unshift(paths);
    this.assign(env);
  }
  public restore(): void {
    const toRestore = Object.keys(this.assigned).reduce(
      (acc: IOfType<string | undefined>, key) => {
        if (this.env[key] === this.assigned[key]) acc[key] = this.initial[key];
        return acc;
      },
      {}
    );

    Object.assign(this.env, toRestore);
    this.assigned = {};
  }
}
