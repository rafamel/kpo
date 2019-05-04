# [0.1.0](https://github.com/rafamel/kpo/compare/v0.0.4...v0.1.0) (2019-05-03)


### Bug Fixes

* overwrites error constructors and helpers for locally imported kpo instances ([0a420d4](https://github.com/rafamel/kpo/commit/0a420d4))
* **core/options:** setBase doesn't strip undefined values to fully preserve passed options ([479165b](https://github.com/rafamel/kpo/commit/479165b))
* **core/tasks:** fixes path parsing and printing ([51d34a3](https://github.com/rafamel/kpo/commit/51d34a3))
* **core/tasks:** tries to run package.json tasks only when task is not found on kpo, but not for any ([20344a8](https://github.com/rafamel/kpo/commit/20344a8))


### Features

* **core:** deals with different executing and imported kpo instances ([2b7478a](https://github.com/rafamel/kpo/commit/2b7478a))
* **core/load:** passes public functions if kpo scripts file exports a function ([04a93b8](https://github.com/rafamel/kpo/commit/04a93b8))



## [0.0.4](https://github.com/rafamel/kpo/compare/v0.0.3...v0.0.4) (2019-05-02)


### Bug Fixes

* **utils/cache, core:** removes cache callback arguments ([dfbd213](https://github.com/rafamel/kpo/commit/dfbd213))
* **utils/confirm:** forces import of transpiled prompts ([8b752d2](https://github.com/rafamel/kpo/commit/8b752d2))


### Features

* **public/fs:** takes string array as src for copy and move ([0521531](https://github.com/rafamel/kpo/commit/0521531))



## [0.0.3](https://github.com/rafamel/kpo/compare/v0.0.2...v0.0.3) (2019-05-01)


### Bug Fixes

* **public/prompts:** forces import of transpiled prompts for confirm and select ([5d5d0d3](https://github.com/rafamel/kpo/commit/5d5d0d3))



## [0.0.2](https://github.com/rafamel/kpo/compare/v0.0.1...v0.0.2) (2019-05-01)


### Bug Fixes

* **public/prompts:** forces transpiled prompts usage ([c7b2697](https://github.com/rafamel/kpo/commit/c7b2697))



## [0.0.1](https://github.com/rafamel/kpo/compare/91d12ab...v0.0.1) (2019-05-01)


### Bug Fixes

* **bin:** catches errors when getting silent option ([856c793](https://github.com/rafamel/kpo/commit/856c793))
* **bin:** fixes help usage instructions ([52381ad](https://github.com/rafamel/kpo/commit/52381ad))
* **commands/list:** fixes list to use core.cwd instead of core.paths ([714835c](https://github.com/rafamel/kpo/commit/714835c))
* **commands/run:** throws when task is not found ([7906ae7](https://github.com/rafamel/kpo/commit/7906ae7))
* **core:** ensures options have been loaded when requesting options; makes options part of core ([492c737](https://github.com/rafamel/kpo/commit/492c737))
* **core/paths:** doesn't throw when root paths retrieval fails and it's not explicitly defined in op ([a7261a4](https://github.com/rafamel/kpo/commit/a7261a4))
* **core/tasks:** fixes purePath regex -default cannot be an intermediary value ([4fdef72](https://github.com/rafamel/kpo/commit/4fdef72))
* **core/tasks:** fixes task names formatting on error messages for getFromKpo ([4bf1fba](https://github.com/rafamel/kpo/commit/4bf1fba))
* **core/tasks:** takes IScripts being an instance of Error into account ([a19b394](https://github.com/rafamel/kpo/commit/a19b394))
* **deps:** adds missing dependency js-yaml; removes dangling ([a3a8183](https://github.com/rafamel/kpo/commit/a3a8183))
* **deps:** updates errorish to v0.2.0 ([0c2e4fa](https://github.com/rafamel/kpo/commit/0c2e4fa))
* **deps:** updates errorish to v0.2.1 ([cc8db44](https://github.com/rafamel/kpo/commit/cc8db44))
* **deps:** updates errorish to v0.3.0 ([a576f09](https://github.com/rafamel/kpo/commit/a576f09))
* **exposed:** uses core.cwd() instead of core.paths() to determine cwd ([dd02f9c](https://github.com/rafamel/kpo/commit/dd02f9c))
* **exposed/fs:** fixes copy, destination existence should be recursively evaluated, hence handled by ([6e709b8](https://github.com/rafamel/kpo/commit/6e709b8))
* **exposed/fs:** fixes relative paths ([0513950](https://github.com/rafamel/kpo/commit/0513950))
* **exposed/line:** fixes tag typings ([9f33f15](https://github.com/rafamel/kpo/commit/9f33f15))
* **exposed/tags:** fixes silent ([f0ac3ea](https://github.com/rafamel/kpo/commit/f0ac3ea))
* **ore/tasks:** fixes error message at getFromKpo ([b3d9d43](https://github.com/rafamel/kpo/commit/b3d9d43))
* **public/exec:** fixes parallel args ([7c2b0ea](https://github.com/rafamel/kpo/commit/7c2b0ea))
* **public/exec:** fixes series.fn types ([5b72565](https://github.com/rafamel/kpo/commit/5b72565))
* **public/fs:** fixes rw fs.ensureDir call ([9fad602](https://github.com/rafamel/kpo/commit/9fad602))
* **state:** fixes state merging ([c146b7b](https://github.com/rafamel/kpo/commit/c146b7b))
* **state/paths:** converts root directory path to absolute, if needed ([aad9f6e](https://github.com/rafamel/kpo/commit/aad9f6e))
* **state/paths:** fixes directory normalization and equality evaluation ([2f5fc9b](https://github.com/rafamel/kpo/commit/2f5fc9b))
* **state/paths:** get paths root scope recursively from directory ([05c6d31](https://github.com/rafamel/kpo/commit/05c6d31))
* **utils/as-tag:** only considers arguments as coming from a template literal if their number matche ([c494a08](https://github.com/rafamel/kpo/commit/c494a08))
* uses WrappedError constructor when an error overwrite is intended ([f72b5a7](https://github.com/rafamel/kpo/commit/f72b5a7))
* **utils/errors:** fixes wrap configuration to always overwrite message ([dc341f4](https://github.com/rafamel/kpo/commit/dc341f4))
* **utils/file:** fixes exists to return void as per typings ([6776e59](https://github.com/rafamel/kpo/commit/6776e59))


### Features

* **bin:** adds cmd ([bb50bf9](https://github.com/rafamel/kpo/commit/bb50bf9))
* **bin:** adds kpo bin and main ([eb0774b](https://github.com/rafamel/kpo/commit/eb0774b))
* **bin:** adds parallel ([1c4098e](https://github.com/rafamel/kpo/commit/1c4098e))
* **bin:** adds raise ([583c6ad](https://github.com/rafamel/kpo/commit/583c6ad))
* **bin:** adds scopes logic ([4d9f822](https://github.com/rafamel/kpo/commit/4d9f822))
* **bin:** adds series ([d38be22](https://github.com/rafamel/kpo/commit/d38be22))
* **bin:** adds stream ([a402da5](https://github.com/rafamel/kpo/commit/a402da5))
* **bin:** ensures param is an Error before logging ([5985ff9](https://github.com/rafamel/kpo/commit/5985ff9))
* **bin:** improves parallel and series help prompt ([dc38d92](https://github.com/rafamel/kpo/commit/dc38d92))
* **bin:** logs full command to be run w/ resolved scopes ([4fc97bc](https://github.com/rafamel/kpo/commit/4fc97bc))
* **bin:** removes --node argument ([cc072b9](https://github.com/rafamel/kpo/commit/cc072b9))
* **bin:** uses commands/run ([b31e3a7](https://github.com/rafamel/kpo/commit/b31e3a7))
* **bin, commands:** adds list ([1a6bd2a](https://github.com/rafamel/kpo/commit/1a6bd2a))
* **bin/kpo:** exists w/ code 1 only if not silent ([610420e](https://github.com/rafamel/kpo/commit/610420e))
* **bin/list, commands/list:** lists scopes ([14306a3](https://github.com/rafamel/kpo/commit/14306a3))
* **bin/main:** updates base state w/ cli options ([2e49b5e](https://github.com/rafamel/kpo/commit/2e49b5e))
* **commands:** adds run ([86d40b5](https://github.com/rafamel/kpo/commit/86d40b5))
* **commands/run:** gets default key for task if it exists ([2787459](https://github.com/rafamel/kpo/commit/2787459))
* **core:** adds children to core entry ([95bda68](https://github.com/rafamel/kpo/commit/95bda68))
* **core:** adds cwd option for IScopeOptions; improves type definitions for package, cli, and core ([63766bc](https://github.com/rafamel/kpo/commit/63766bc))
* **core:** adds run ([7ca5479](https://github.com/rafamel/kpo/commit/7ca5479))
* **core:** allows exec to take cwd and env options ([757559c](https://github.com/rafamel/kpo/commit/757559c))
* **core:** allows options to be defined at kpo package.json key ([6297145](https://github.com/rafamel/kpo/commit/6297145))
* **core:** allows relative paths as cwd on exec ([a294f8b](https://github.com/rafamel/kpo/commit/a294f8b))
* **core/load:** gets scripts key and sets options from options key from kpo scripts file if not a j ([5c54850](https://github.com/rafamel/kpo/commit/5c54850))
* **core/options:** adds forceUpdate ([1dd5648](https://github.com/rafamel/kpo/commit/1dd5648))
* **core/options:** allows directory to also be defined at IScopeOptions ([8b0f221](https://github.com/rafamel/kpo/commit/8b0f221))
* **core/options:** gives priority to cli options ([c9a2b5b](https://github.com/rafamel/kpo/commit/c9a2b5b))
* **core/options:** uses object hash to identify options ([fcd9122](https://github.com/rafamel/kpo/commit/fcd9122))
* **core/scope:** recurses up to [@root](https://github.com/root) looking for children scopes ([c3640b0](https://github.com/rafamel/kpo/commit/c3640b0))
* **core/tasks:** adds tasks to core ([de93899](https://github.com/rafamel/kpo/commit/de93899))
* **errors:** adds CustomError and WrappedError ([06e7010](https://github.com/rafamel/kpo/commit/06e7010))
* **exposed:** adds confirm prompt ([76f99e5](https://github.com/rafamel/kpo/commit/76f99e5))
* **exposed:** adds exposed w/ options ([a65f650](https://github.com/rafamel/kpo/commit/a65f650))
* **exposed:** adds parallel ([9a735f6](https://github.com/rafamel/kpo/commit/9a735f6))
* **exposed:** adds series ([dcdb7c7](https://github.com/rafamel/kpo/commit/dcdb7c7))
* **exposed:** adds silent ([312c676](https://github.com/rafamel/kpo/commit/312c676))
* **exposed:** adds trim ([164e7eb](https://github.com/rafamel/kpo/commit/164e7eb))
* **exposed:** replaces trim w/ line -adds line ([7d3baab](https://github.com/rafamel/kpo/commit/7d3baab))
* **exposed:** wraps all exposed fns errors as WrappedError, so their stacktrace doesn't get logged ([ec911e3](https://github.com/rafamel/kpo/commit/ec911e3))
* **exposed/exec:** adds series.env and parallel.env ([063fcba](https://github.com/rafamel/kpo/commit/063fcba))
* **exposed/exists:** adds exists ([758ad8d](https://github.com/rafamel/kpo/commit/758ad8d))
* **exposed/file:** adds json ([6e7efb2](https://github.com/rafamel/kpo/commit/6e7efb2))
* **exposed/file:** adds remove ([75d114f](https://github.com/rafamel/kpo/commit/75d114f))
* **exposed/fs:** adds copy ([9a5c313](https://github.com/rafamel/kpo/commit/9a5c313))
* **exposed/fs:** adds move ([0acf5a5](https://github.com/rafamel/kpo/commit/0acf5a5))
* **exposed/fs:** adds write ([8706280](https://github.com/rafamel/kpo/commit/8706280))
* **exposed/fs:** improves logger messages ([98d3474](https://github.com/rafamel/kpo/commit/98d3474))
* **exposed/fs:** moves file to fs; improves functions implementation and typings; adds rw ([3a235cd](https://github.com/rafamel/kpo/commit/3a235cd))
* **exposed/fs, exposed/tags:** adds mkdir; uses mkdir on ensure ([6109bf8](https://github.com/rafamel/kpo/commit/6109bf8))
* **exposed/prompts:** adds select prompt ([71cdfa7](https://github.com/rafamel/kpo/commit/71cdfa7))
* **exposed/prompts:** confirm shows timeout if passed ([316da0e](https://github.com/rafamel/kpo/commit/316da0e))
* **exposed/tags:** adds ensure ([28adb76](https://github.com/rafamel/kpo/commit/28adb76))
* **exposed/tags:** adds exists ([2808b7c](https://github.com/rafamel/kpo/commit/2808b7c))
* **exposed/tags:** adds log ([c9b3a1c](https://github.com/rafamel/kpo/commit/c9b3a1c))
* **exposed/tags:** adds rm ([aba9763](https://github.com/rafamel/kpo/commit/aba9763))
* **options:** implements and exports options from entry point ([3f0ae47](https://github.com/rafamel/kpo/commit/3f0ae47))
* **parse:** adds getFile ([4da7cd9](https://github.com/rafamel/kpo/commit/4da7cd9))
* **parse:** adds readFile and IScripts type ([1cd195c](https://github.com/rafamel/kpo/commit/1cd195c))
* **parse/load:** returns package.json and redesigns getFile ([23480a7](https://github.com/rafamel/kpo/commit/23480a7))
* **public/exec:** adds stream ([76da0d0](https://github.com/rafamel/kpo/commit/76da0d0))
* **public/kpo:** adds raise ([4408633](https://github.com/rafamel/kpo/commit/4408633))
* **public/kpo:** takes scripts to replace into account on raise ([33e0e83](https://github.com/rafamel/kpo/commit/33e0e83))
* **state:** adds paths ([96fd89b](https://github.com/rafamel/kpo/commit/96fd89b))
* **state:** adds scope ([c691501](https://github.com/rafamel/kpo/commit/c691501))
* **state:** adds state, moves parse/load ([aba1998](https://github.com/rafamel/kpo/commit/aba1998))
* **state:** allows root scope to be set as null ([87e80b9](https://github.com/rafamel/kpo/commit/87e80b9))
* **state:** get unsafely retrieves values for keys ([cb6a334](https://github.com/rafamel/kpo/commit/cb6a334))
* **state:** separates load into paths and load; gets root paths ([ea2b809](https://github.com/rafamel/kpo/commit/ea2b809))
* **state:** sets logger level on state merging ([7e7e190](https://github.com/rafamel/kpo/commit/7e7e190))
* **state/load:** sets cwd as default directory ([f673347](https://github.com/rafamel/kpo/commit/f673347))
* **state/paths:** retrieves bin paths recursively for current and root scopes ([a92997e](https://github.com/rafamel/kpo/commit/a92997e))
* **state/scope:** adds getChildren ([9fb9ddf](https://github.com/rafamel/kpo/commit/9fb9ddf))
* **types:** allows circular renference as Array and falsy values for TScript ([657ad24](https://github.com/rafamel/kpo/commit/657ad24))
* **types:** improves TScript typings ([57bfc0c](https://github.com/rafamel/kpo/commit/57bfc0c))
* adds optional name field to IChild ([6596a1e](https://github.com/rafamel/kpo/commit/6596a1e))
* **types:** separates IOptions into IBaseOptions and IScopeOptions; ensures IBaseOptions are preser ([78d5fd7](https://github.com/rafamel/kpo/commit/78d5fd7))
* **utils:** adds asTag ([87eae18](https://github.com/rafamel/kpo/commit/87eae18))
* improves logged messages ([d1c7751](https://github.com/rafamel/kpo/commit/d1c7751))
* **utils:** adds confirm ([fc40be3](https://github.com/rafamel/kpo/commit/fc40be3))
* **utils:** adds ensure ([91d12ab](https://github.com/rafamel/kpo/commit/91d12ab))
* **utils:** adds expose ([a3ba5ca](https://github.com/rafamel/kpo/commit/a3ba5ca))
* **utils:** adds file utils ([c8b5c75](https://github.com/rafamel/kpo/commit/c8b5c75))
* **utils:** adds memoize ([24212ed](https://github.com/rafamel/kpo/commit/24212ed))
* **utils:** adds open ([4ceb22b](https://github.com/rafamel/kpo/commit/4ceb22b))
* **utils:** substitutes memoize w/ cache; cache now takes a getId function to identify state ([d2cc870](https://github.com/rafamel/kpo/commit/d2cc870))
* **utils/errors:** adds custom name getter for error classes ([3a5191b](https://github.com/rafamel/kpo/commit/3a5191b))
* **utils/exec:** adds exec ([74e1ed2](https://github.com/rafamel/kpo/commit/74e1ed2))
* **utils/exec:** kills dangling child processes on main process exit ([f955538](https://github.com/rafamel/kpo/commit/f955538))
* **utils/exec:** passes environment variables w/ state envs and paths by default; returns a promise ([6ed1eef](https://github.com/rafamel/kpo/commit/6ed1eef))
* passes arguments to tasks, both for commands and functions ([18042df](https://github.com/rafamel/kpo/commit/18042df))
* uses OpenError to log full errors as long as logger is not silent when it ocurrs on task funct ([282fdfc](https://github.com/rafamel/kpo/commit/282fdfc))
* **utils/exec:** sets options as optional ([0f68e72](https://github.com/rafamel/kpo/commit/0f68e72))
* **utils/exec:** spawns w/ project directory as cwd ([ab692bc](https://github.com/rafamel/kpo/commit/ab692bc))
* **utils/exec, core/exec:** adds forking capability to exec ([5e4aa6a](https://github.com/rafamel/kpo/commit/5e4aa6a))
* **utils/file:** adds absolute ([69532e0](https://github.com/rafamel/kpo/commit/69532e0))
* **utils/file:** adds load ([e9f823f](https://github.com/rafamel/kpo/commit/e9f823f))
* **utils/logger:** adds logger ([78676b4](https://github.com/rafamel/kpo/commit/78676b4))


