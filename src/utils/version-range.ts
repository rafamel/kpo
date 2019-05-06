import { clean, diff } from 'semver';

export default function inVersionRange(
  local?: string | null,
  executable?: string | null
): void {
  local = local && clean(local);
  executable = executable && clean(executable);

  if (!local || !executable) throw Error(`Version could not be parsed`);

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
