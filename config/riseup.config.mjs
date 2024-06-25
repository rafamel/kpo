import { Preset } from '@riseup/utils';
import { Library } from '@riseup/library';
import { Universal } from '@riseup/universal';

export default Preset.combine(
  new Library({
    distribute: {
      // Push repository and tags upon distribution (publication)
      push: true
    }
  }),
  new Universal({
    release: {
      // Conventional commits preset
      preset: 'angular',
      // Generate changelog upon release (version bump)
      changelog: true
    }
  })
);
