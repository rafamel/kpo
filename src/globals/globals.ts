import { GLOBALS_KEY, TGlobal } from '~/constants';

export default ((global as any)[GLOBALS_KEY] ||
  ((global as any)[GLOBALS_KEY] = {})) as { [key in TGlobal]: any };
