import EnvManager from '~/utils/env-manager';
import logger, { setLevel } from '~/utils/logger';
import { TLogger } from '~/types';

export default class StateManager extends EnvManager {
  private origin: { cwd: string; level: number };
  private current: { cwd: string; level: number };
  public constructor() {
    super(process.env);

    this.origin = { cwd: process.cwd(), level: logger.getLevel() };
    this.current = Object.assign({}, this.origin);
  }
  public setCwd(path: string): void {
    process.chdir(path);
    if (path !== this.current.cwd) {
      logger.debug('CWD set to: ' + path);
      this.current.cwd = path;
    }
  }
  public setLogger(level: TLogger): void {
    setLevel(level);
    const current = logger.getLevel();
    if (current !== this.current.level) {
      logger.debug('Logging level set to: ' + level);
      this.current.level = current;
    }
  }
  public restore(): void {
    this.setCwd(this.origin.cwd);
    this.setLogger(this.origin.level as any);
    this.current = Object.assign({}, this.origin);

    super.restore();
  }
}
