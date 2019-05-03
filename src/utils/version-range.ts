import { clean, diff } from 'semver';

export default function versionRange(
  executable?: string,
  local?: string
): void {
  const versions = [executable && clean(executable), local && clean(local)];
  if (!versions[0] || !versions[1]) throw Error(`Version could not be parsed`);

  const release = diff(versions[0] as string, versions[1] as string);

  // Error out if difference is a major version or we're on v0.x.x
  if (
    release === 'major' ||
    release === 'premajor' ||
    (release && (versions[0] as string)[0] === '0')
  ) {
    throw Error(
      `Local kpo version (${versions[1]})` +
        ` doesn't match executing version (${versions[0]})`
    );
  }
}
