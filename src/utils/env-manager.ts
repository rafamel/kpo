import pathKey from 'path-key';
import alter from 'manage-path';
import { IOfType } from '~/types';

export class EnvManager {
  public path: string;
  private env: IOfType<string | undefined>;
  private initial: IOfType<string | undefined>;
  private assigned: IOfType<string | undefined>;
  public constructor(env: IOfType<string | undefined>) {
    this.path = pathKey({ env });
    this.env = env;
    this.initial = Object.assign({}, env);
    this.assigned = {};
  }
  public get purePaths(): string | undefined {
    return this.initial[this.path];
  }
  public addPaths(paths: string[]): void {
    const env = { PATH: this.env[this.path] };
    alter(env).unshift(paths);
    this.assign({ [this.path]: env.PATH });
  }
  public assign(env: IOfType<string | undefined>): void {
    Object.assign(this.env, env);
    Object.assign(this.assigned, env);
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
    this.initial = Object.assign({}, this.env);
    this.assigned = {};
  }
}

export default new EnvManager(process.env);