import { clean, diff } from 'semver';
import pkg from './pkg';
import globals from './globals';

export default function inVersionRange(): void {
  if (!globals.version) {
    globals.version = clean(pkg().version);
    return;
  }

  const executable = globals.version && clean(globals.version);
  const local = pkg().version && clean(pkg().version);

  if (!executable || !local) throw Error(`Version could not be parsed`);

  const release = diff(executable, local);

  // `false` if difference is a major version or we're on v0.x.x
  if (
    release !== 'major' &&
    release !== 'premajor' &&
    (!release || (local as string)[0] !== '0')
  ) {
    return;
  }

  throw Error(
    `Local kpo version (${local})` +
      ` doesn't match executing version (${executable})`
  );
}
