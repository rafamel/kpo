# [0.23.0](https://github.com/rafamel/kpo/compare/v0.21.0...v0.23.0) (2022-03-15)


### Bug Fixes

* coerce unknown thrown objects into errors ([38b9e22](https://github.com/rafamel/kpo/commit/38b9e2216787bc860c71c8217f0304eaad6038a7))
* **deps:** update dependencies ([e265161](https://github.com/rafamel/kpo/commit/e26516158f73b37cf8c13d13d19a9becae99952c))
* **tasks:** mkdir rejects on failed operations ([660bcca](https://github.com/rafamel/kpo/commit/660bcca4e5b221163f2853211f0b0fd37a8380e6))


### Code Refactoring

* rewrite for esm ([67e6b4d](https://github.com/rafamel/kpo/commit/67e6b4dfe3f11c113ff6f382945d6442fbc2b868))


### Features

* takes a task record or task record returning function as default export for kpo.tasks.js ([74b04cb](https://github.com/rafamel/kpo/commit/74b04cb26cfa5335c760bc8b7dcef852b5a57430))


### Reverts

* **tasks:** create doesn't take multiple arguments ([2685277](https://github.com/rafamel/kpo/commit/2685277f49b5aa5e3ec53c9115c2f512fc6e9b5e))


### BREAKING CHANGES

* Drops node <16 support



# [0.21.0](https://github.com/rafamel/kpo/compare/v0.20.0...v0.21.0) (2021-04-20)


### Features

* all functions taking options and tasks take options as a parameter before tasks ([44f5479](https://github.com/rafamel/kpo/commit/44f54792fe8394ceeeb07da1aef029000544c04a))
* **cli:** don't notify of updates when run in npm scripts by default ([4e4d542](https://github.com/rafamel/kpo/commit/4e4d542b51166223a32eef4c787c5753b6c2c293))
* **tasks:** take any number of tasks on finalize ([e0f1cc6](https://github.com/rafamel/kpo/commit/e0f1cc67cad6a4e40b44e50a3fc687b2ad0c114a))
* **utils:** add isLevelActive ([700ce5c](https://github.com/rafamel/kpo/commit/700ce5c07fa6ccec19fae1fef68214782e95d2c7))



# [0.20.0](https://github.com/rafamel/kpo/compare/v0.19.0...v0.20.0) (2021-04-18)


### Bug Fixes

* **deps:** update dependencies ([d74828f](https://github.com/rafamel/kpo/commit/d74828f842b6236cda17a80039fade16dba3010f))
* **tasks:** add badge to prompt message ([3de514a](https://github.com/rafamel/kpo/commit/3de514a5fdd2d5567528060eb4b2f4d1ebe7767c))
* **tasks:** clear listeners and input stream on select finalization ([048ca7d](https://github.com/rafamel/kpo/commit/048ca7ddb5357518910ac6ece53aa9ef4bf1a97e))
* **tasks:** fix prompt block on windows ([38978d7](https://github.com/rafamel/kpo/commit/38978d7f8cfd9fcf80785c639360366788e3ce46))


### Features

* **cli:** add update notifier ([ab0d23f](https://github.com/rafamel/kpo/commit/ab0d23f9fd5c97816f1d316540febb4d6ffb2f8e))



# [0.19.0](https://github.com/rafamel/kpo/compare/v0.18.0...v0.19.0) (2021-04-15)


### Bug Fixes

* **tasks:** prefix stdout for progress, prompt, select ([0e25098](https://github.com/rafamel/kpo/commit/0e25098b80856c12aec8be18cf178a2937df10aa))


### Features

* adapt lift for multitask; change lift mode names and default ([afb6efd](https://github.com/rafamel/kpo/commit/afb6efd5595388f4e2edffbce0ef8f9a8718b3a1))



# [0.18.0](https://github.com/rafamel/kpo/compare/v0.17.1...v0.18.0) (2021-04-09)


### Bug Fixes

* **deps:** update ci-info to 3.1.1 ([9f360e8](https://github.com/rafamel/kpo/commit/9f360e88e1d8fd9a2df1b9181fee0091de9002dd))
* fixes bin path in package.json ([95a0e18](https://github.com/rafamel/kpo/commit/95a0e18a5d64ce199e6b9e38bcc7d020a9a03b70))
* **tasks:** catches and finalize stop on cancellation ([7527388](https://github.com/rafamel/kpo/commit/7527388957312b0e881855aeace902a485d4e2f3))
* **tasks:** exec uses first argument for errors when executing node ([ffbd42c](https://github.com/rafamel/kpo/commit/ffbd42c4ba3a7f06c752c4a94bc17a86a7c9bf99))
* **tasks:** fix select feedback messages ([0cf4fd8](https://github.com/rafamel/kpo/commit/0cf4fd8b9c560d64f7018ed2c4cbf927e91f19e8))
* **utils:** run doesn't throw when cancelled ([f3cf37b](https://github.com/rafamel/kpo/commit/f3cf37b55ccac6bb10dfa7fda45014e79aa331cb))


### Features

* allow for context stdio streams to be null; remove interactive option for context and bin ([2655d06](https://github.com/rafamel/kpo/commit/2655d06fc802880cf021402519782dc92196120a))
* **cli:** rename bin function to cli, allow for command extensions and single/multi task modes ([1d26381](https://github.com/rafamel/kpo/commit/1d26381aa15fe23cb838bc05aa09ec4c54103510))
* implement interactive/non-interactive contexts; add task and utils ([756fab7](https://github.com/rafamel/kpo/commit/756fab7e39042342c9f95238f3e2f44a6a7e73fe))
* improve logging format on unicode supporting environments; add success log level ([f410ac6](https://github.com/rafamel/kpo/commit/f410ac6eed8d4b14c513686526d5a57999cc0b39))
* log all errors w/ trace level ([96425e0](https://github.com/rafamel/kpo/commit/96425e085c8385b730491acb4aa09a99f8e8245e))
* **tasks,bin:** add fail option to watch task and command ([a329ad5](https://github.com/rafamel/kpo/commit/a329ad5851e2979ff2691c1ddfbf62de7cfb68d0))
* **tasks:** add confirm task ([ff3cecc](https://github.com/rafamel/kpo/commit/ff3cecc3559fb26224c974b4f69767bd91e69ef9))
* **tasks:** add name option for announce ([6b32f6b](https://github.com/rafamel/kpo/commit/6b32f6bebaa23f60cdf0021f3ab3ac489d23c193))
* **tasks:** add progress task ([a3709d8](https://github.com/rafamel/kpo/commit/a3709d8d1ba64027058ba5b86965ff5defc92dbf))
* **tasks:** add prompt task ([1404baf](https://github.com/rafamel/kpo/commit/1404baf1ba44b8136f300d23126f229e0eb04fa6))
* **tasks:** add repeat task ([67db390](https://github.com/rafamel/kpo/commit/67db390d2b9ad0b1c1d44ba4144675e10a4b888a))
* **tasks:** add silence task ([ef894a2](https://github.com/rafamel/kpo/commit/ef894a2eb81b3ddd7ba01b2df5574f3fe825758d))
* **tasks:** add timeout task ([df676d6](https://github.com/rafamel/kpo/commit/df676d62cf0011bb7c262725568163cd57dc5a24))
* **tasks:** create pipes passed functions and checks for cancellation ([f28c215](https://github.com/rafamel/kpo/commit/f28c215e06de7e10b3356d177c13fe124ebb43ca))
* **tasks:** optionally log task success on announce ([8463a82](https://github.com/rafamel/kpo/commit/8463a823aecdc71ea9782e56b1a5e6b933e0de22))
* **tasks:** suppress stdin on parallel tasks ([cd91867](https://github.com/rafamel/kpo/commit/cd918675950305a6b8fb5246bc1e2698b9539683))
* **utils:** export style util ([cc6bb50](https://github.com/rafamel/kpo/commit/cc6bb505dfdf39ebe9cf632ecf0891939b6eb620))



## [0.17.1](https://github.com/rafamel/kpo/compare/v0.17.0...v0.17.1) (2021-04-04)


### Bug Fixes

* fix type definitions build ([fada578](https://github.com/rafamel/kpo/commit/fada578878a927b828056a33f10a5ff5e1b01429))



# [0.17.0](https://github.com/rafamel/kpo/compare/v0.16.0...v0.17.0) (2021-04-04)


### Bug Fixes

* default options assignment for undefined values -uses merge-strategies ([b3f430c](https://github.com/rafamel/kpo/commit/b3f430ca56cf5e32c482da2b516461337a543b44))
* fix stdout clear for watch task and command ([a1cc544](https://github.com/rafamel/kpo/commit/a1cc5442fb905cbc477dfb2ebafe3c1f8a9da5d1))
* **tasks:** fix context merge ([2ff3f85](https://github.com/rafamel/kpo/commit/2ff3f8560c2d5eb3fc131ee2994a7fe64922f112))
* **tasks:** fix lift confirm mode when there are no pending changes ([cc7576d](https://github.com/rafamel/kpo/commit/cc7576d24cc0a46ce24c719c801c00472a51825c))


### Features

* allow combine task and recreate util to take a Task.Record returning function ([2b409da](https://github.com/rafamel/kpo/commit/2b409da3b21bcc10ba8af1b9f99046d78bb19299))
* allow context prefix to be a boolean ([405b0ce](https://github.com/rafamel/kpo/commit/405b0ce60ae879b1586a8f1bb40dfb358377c66b))
* differentiate between print and key route names ([11e8755](https://github.com/rafamel/kpo/commit/11e87552cd6c6673c2e007d9c250ae502392183e))
* lift and list tasks can fetch default tasks file; fetch will use the default tasks file name when none is provided ([2c939b0](https://github.com/rafamel/kpo/commit/2c939b0e600a31cd3f3f08c3ca1958a7295afc3f))
* **tasks:** add announce task ([3182d0a](https://github.com/rafamel/kpo/commit/3182d0a9f319515e3e1c7ab3d0093d6a01fbf9e5))
* **tasks:** add clear option to watch task; modify watch options names and function signature ([165233b](https://github.com/rafamel/kpo/commit/165233bc0b8c98ed3398cb545ec1284f81a7f477))
* **tasks:** allow log task to take silent as a level ([19170ca](https://github.com/rafamel/kpo/commit/19170ca69d007fbb010641a1f8be84489abfe44d))
* **tasks:** combine task takes include, exclude, and defaults options ([c9f948a](https://github.com/rafamel/kpo/commit/c9f948a6b15d087ec32ff698f66f679d0bc42315))
* **tasks:** lift and list tasks can no longer fetch task files ([2079576](https://github.com/rafamel/kpo/commit/2079576e11c16c928f749316b19d21f19186abcb))
* **tasks:** remove defaults option for combine: default tasks will be combined unless explicitly excluded ([ba1f0cc](https://github.com/rafamel/kpo/commit/ba1f0cc22a97854f0235bd56037a83d61dae28af))
* treat 'default' keys in Task.Record as the task to be run for its top level ([90c1527](https://github.com/rafamel/kpo/commit/90c15275d84ce57c51c3f95e634d991af0822c53))



# [0.16.0](https://github.com/rafamel/kpo/compare/v0.15.0...v0.16.0) (2021-04-02)


### Features

* **tasks:** add bundle task ([241de8a](https://github.com/rafamel/kpo/commit/241de8ab2efda7edb006e88cb445ea5d6a64cc5b))



# [0.15.0](https://github.com/rafamel/kpo/compare/v0.14.0...v0.15.0) (2021-04-01)


### Bug Fixes

* propagate bin name at lift and list subcommand and task ([ad142f6](https://github.com/rafamel/kpo/commit/ad142f6d9918367bf5f2f488168c658f25f664c5))


### Features

* add exclude to watch task; add exclude and clear to watch subcommand ([9be1ae5](https://github.com/rafamel/kpo/commit/9be1ae54ec086d43eb52a1970fe31d6359ff1eb2))
* **bin:** add description and version options to exported bin function ([97a4ab2](https://github.com/rafamel/kpo/commit/97a4ab2b1656b6b4191737fa322d4c8f4a33f7fb))



# [0.14.0](https://github.com/rafamel/kpo/compare/v0.13.0...v0.14.0) (2021-03-31)


### Bug Fixes

* **tasks:** set briefError option for exec task as optional ([07e3b6f](https://github.com/rafamel/kpo/commit/07e3b6fe764487bb7dd7aac6a6a290f1fed5777e))


### Features

* **bin:** add :watch subcommand ([6d2c994](https://github.com/rafamel/kpo/commit/6d2c9940607f4f14643abec5e71744a45393f3fd))



# [0.13.0](https://github.com/rafamel/kpo/compare/v0.11.1...v0.13.0) (2021-03-29)


### Bug Fixes

* **deps:** updates dependencies ([3d16988](https://github.com/rafamel/kpo/commit/3d16988be37562fffb12aba1e5365bfbd8993637))
* **deps:** updates dependencies ([a29a433](https://github.com/rafamel/kpo/commit/a29a43377d3ee41534d8a5326feb939e31ef97b3))
* **tasks:** fixes exec ([f3df732](https://github.com/rafamel/kpo/commit/f3df732a24ca528e78c9b589bd602553e01cd752))
* **utils:** fixes fetch ([33391e3](https://github.com/rafamel/kpo/commit/33391e314707cc09b400f84060493a4190a308bd))


### chore

* reboots package development ([7dc8bae](https://github.com/rafamel/kpo/commit/7dc8baebb475652c71267790867cb130c4c5ef1d))


### Features

* **bin:** adds cli ([0acf8bb](https://github.com/rafamel/kpo/commit/0acf8bbe388f63a2ae7d52c5dc6b323fcdb26010))
* **bin:** allow for custom bin name, export as function ([870ed67](https://github.com/rafamel/kpo/commit/870ed67a4fe851664cd533df55180d404695093c))
* **definitions:** adds initial definitions ([89f1d1f](https://github.com/rafamel/kpo/commit/89f1d1f638888c5bbe1d4ae15ae123741a643e26))
* removes parse util in favor of added combine task and recreate util ([dbca481](https://github.com/rafamel/kpo/commit/dbca481a4098a0fc1d1ae84b8f14d0465d65745d))
* routes are stringified by introducing a ':' character separation ([a381d34](https://github.com/rafamel/kpo/commit/a381d34637b15f231c8ef774eb3c4b408ef7076f))
* **tasks:** add briefError option to exec task ([166e37d](https://github.com/rafamel/kpo/commit/166e37d05d0f84ab99068a781509bcf3f7c7c024))
* **tasks:** adds catches transform ([c7bb182](https://github.com/rafamel/kpo/commit/c7bb1829412ae5fca672b10dc8fa03fbc4e26032))
* **tasks:** adds clear task ([94ed15c](https://github.com/rafamel/kpo/commit/94ed15ccf66ac25e7bc074f3f17bd7fbe8b260c6))
* **tasks:** adds consume function parse ([a104a06](https://github.com/rafamel/kpo/commit/a104a067f54bcbb8226f136cf0db63ab4f97c45a))
* **tasks:** adds context transform ([4494630](https://github.com/rafamel/kpo/commit/4494630f5267ef07b0377d405015d866da85c5ee))
* **tasks:** adds copy task ([1a6da16](https://github.com/rafamel/kpo/commit/1a6da161fbfc91185f9d646d0106aaf67ca1c27d))
* **tasks:** adds edit task ([8f09b48](https://github.com/rafamel/kpo/commit/8f09b4898d265f59abb9f24219d7fdf3414d297a))
* **tasks:** adds exec task ([3e88259](https://github.com/rafamel/kpo/commit/3e882596087f04e50a7486d9fa5c222b09ac5ea6))
* **tasks:** adds finalizes transform task ([581461c](https://github.com/rafamel/kpo/commit/581461ce85fc3ec4ecfd87e67cbe3862a3ac925f))
* **tasks:** adds lift command ([b1cef1f](https://github.com/rafamel/kpo/commit/b1cef1f59c196f3022c5d7ee3bb940bfb7d1970e))
* **tasks:** adds list command ([7b4d29d](https://github.com/rafamel/kpo/commit/7b4d29d16f3e3e75ab76b46d6788571f80dac315))
* **tasks:** adds log task ([2883ee0](https://github.com/rafamel/kpo/commit/2883ee080feed207fc7a2444cf1803d2f90bb026))
* **tasks:** adds mkdir task ([b560772](https://github.com/rafamel/kpo/commit/b5607720ed354d3c84d51988c268773f0249e3d9))
* **tasks:** adds move task ([192ed1c](https://github.com/rafamel/kpo/commit/192ed1c63725cac3b9aab7afbc043f25505d2cd0))
* **tasks:** adds parallel transform ([689c555](https://github.com/rafamel/kpo/commit/689c555945a7130e9f351b5ac7b2b60a2b26c7ad))
* **tasks:** adds print task ([7949e39](https://github.com/rafamel/kpo/commit/7949e391e530b343a69138d043ac56d18aa99719))
* **tasks:** adds raises task ([f3f0c5d](https://github.com/rafamel/kpo/commit/f3f0c5d4b34921a35a502010b6acc91c56a04b94))
* **tasks:** adds remove task ([fb53a87](https://github.com/rafamel/kpo/commit/fb53a878a8e804062c602332075fb087d226772d))
* **tasks:** adds select transform ([b788530](https://github.com/rafamel/kpo/commit/b78853072089178f0cd80caf7b5106bce61b6935))
* **tasks:** adds series transform ([e9b12d0](https://github.com/rafamel/kpo/commit/e9b12d0209c0f1a99abbab90e7e2e871b4f92b3c))
* **tasks:** adds sleep task ([1964dc8](https://github.com/rafamel/kpo/commit/1964dc8c11c34ad0b555fa5db401271b448c19c4))
* **tasks:** adds task runner function run ([c6afed2](https://github.com/rafamel/kpo/commit/c6afed233c97cca4f3ffdf3af6c0f374b1470364))
* **tasks:** adds watch task ([28e4aa4](https://github.com/rafamel/kpo/commit/28e4aa4874e9377b8dfcb4b365acc573607238f5))
* **tasks:** adds write task ([86a44ed](https://github.com/rafamel/kpo/commit/86a44edfedb65afe014daafa18a5482431af02c9))
* **tasks:** list prints the command for tasks and their indented structure ([6bcb47e](https://github.com/rafamel/kpo/commit/6bcb47e28b1d135129dcf672e50a109a22824107))
* **tasks:** list takes a map function ([71cea40](https://github.com/rafamel/kpo/commit/71cea40d124d2ae2c8f279d4d5fe02a3f5fd3f86))
* **tasks:** print can take no arguments ([df08e29](https://github.com/rafamel/kpo/commit/df08e299372ea45104186178aea29a879cc1eca8))
* **tasks:** raises can take a string as an argument ([f0dbd5a](https://github.com/rafamel/kpo/commit/f0dbd5aad88a443e714352d81788f282ac48b699))
* **tasks:** series and parallel can take a task array or record as a first argument ([8ab3802](https://github.com/rafamel/kpo/commit/8ab3802e1b265adacf9672cb9897ca575500f287))
* **utils:** adds fetch util ([ec932be](https://github.com/rafamel/kpo/commit/ec932bec59920c101be58c63ee82e799a6d7eef8))
* **utils:** adds isCancelled ([8535df8](https://github.com/rafamel/kpo/commit/8535df8a20c4a1b8c084b1d9cb903c3b246ab5a3))


### BREAKING CHANGES

* This package api has been entirely redesigned. Please check the latest docs.



## [0.11.1](https://github.com/rafamel/kpo/compare/v0.11.0...v0.11.1) (2019-11-01)


### Bug Fixes

* updates setup and dependencies ([e6492a4](https://github.com/rafamel/kpo/commit/e6492a4d53e4a461218d6a8513941f2bc1e34be6))


### Reverts

* **public/tags:** runs kpo without spawning a new process ([8fe287f](https://github.com/rafamel/kpo/commit/8fe287ff534ada9af2c6c02d4e59f35eb52c660c))



# [0.11.0](https://github.com/rafamel/kpo/compare/v0.10.0...v0.11.0) (2019-06-17)


### Bug Fixes

* **utils/exec:** fixes arguments not being properly parsed as spawn is always used w/ shell=true ([d864efb](https://github.com/rafamel/kpo/commit/d864efb5cadf50af729b9dce360e2d6c331fba2e))


### Features

* **core/tasks:** binds function tasks to their parent object ([29c43dd](https://github.com/rafamel/kpo/commit/29c43dd462e301d6ca5ccb540c5f659c96299a11))


### Reverts

* **public/stages:** removes stages ([8a17831](https://github.com/rafamel/kpo/commit/8a178311888f0cd3b61566949518a30d2dcf3248))


### BREAKING CHANGES

* **public/stages:** Removes public stages function



# [0.10.0](https://github.com/rafamel/kpo/compare/v0.9.1...v0.10.0) (2019-06-11)


### Bug Fixes

* **deps:** updates dependencies ([a2043f5](https://github.com/rafamel/kpo/commit/a2043f5b373bbeeefaf2518f41da6b5d919c5965))
* **public:** fixes json typings ([7e6e89f](https://github.com/rafamel/kpo/commit/7e6e89f8957619807f4b006110139b2b8da94ef5))


### Features

* **public:** adds stages ([6d5c6c9](https://github.com/rafamel/kpo/commit/6d5c6c9931b9b50729e5bbd57b3dbcec705ec9ec))



## [0.9.1](https://github.com/rafamel/kpo/compare/v0.9.0...v0.9.1) (2019-05-22)


### Bug Fixes

* **core:** ensures core initialization on retrieval ([333cb26](https://github.com/rafamel/kpo/commit/333cb2670c1a9d69de104bea849595002c32f265))
* **deps:** updates dependencies ([e5abae6](https://github.com/rafamel/kpo/commit/e5abae628542d27bb9e4c10b9a2531971baa92e5))
* **public/fs:** correctly identifies skipped copies for !options.overwrite and destination is an exi ([7da1874](https://github.com/rafamel/kpo/commit/7da18744786006f50c9d340000dd3d168d8950ba))
* **public/fs:** guarantees utils src/dest resolver callbacks run serially ([8111110](https://github.com/rafamel/kpo/commit/81111105776f8aadc0aa85bfea60c711e56bd5be))



# [0.9.0](https://github.com/rafamel/kpo/compare/v0.8.0...v0.9.0) (2019-05-20)


### Code Refactoring

* **public/fs:** armonizes callbacks behavior for fs functions ([74f0bec](https://github.com/rafamel/kpo/commit/74f0bece8507b3f5132a1e867d20bca2d31f51f3))
* **public/fs:** write, rw, and json callbacks take an object instead of several params ([d43f33a](https://github.com/rafamel/kpo/commit/d43f33afbb57281fc086fc82d9fd73de5fa48e16))


### Features

* **public/fs:** rw and json can take a dest param ([d6bbd0a](https://github.com/rafamel/kpo/commit/d6bbd0acc2569af26ae05a7493dd283329d29f15))


### BREAKING CHANGES

* **public/fs:** Callbacks for fs functions now receive an object with the appropriate data for each
case
* **public/fs:** write, rw, and json callbacks signature has changed



# [0.8.0](https://github.com/rafamel/kpo/compare/v0.7.0...v0.8.0) (2019-05-20)


### Features

* **fs/tags:** globs is an exposed function ([cf99127](https://github.com/rafamel/kpo/commit/cf99127aa5cef28992f544642d0d0e64875688b9))
* **public/fs:** allows all fs functions to take sources arrays; unifies behavior ([d0f6536](https://github.com/rafamel/kpo/commit/d0f653665fbff35853411372dd44200e9e1e9b14))
* **public/fs:** allows destination to be a from/to map for copy and move ([8369346](https://github.com/rafamel/kpo/commit/836934695b5f20ed9ecb3c16d66c0884e8834583))
* **public/fs:** allows sources to be array returning functions ([1c5786b](https://github.com/rafamel/kpo/commit/1c5786b8c75fd041c85d6dd550b58d73d6792e7d))
* **public/fs:** exports types ([ee7a7b6](https://github.com/rafamel/kpo/commit/ee7a7b61124159b5a9d285094efbae29f66de14d))
* **public/fs:** options take a logger key to disable logging ([33209be](https://github.com/rafamel/kpo/commit/33209be90c5a2127679c840d4bb362db28f6d5b6))


### BREAKING CHANGES

* **fs/tags:** Glob previously returned a promise; it now returns a promise returning function



# [0.7.0](https://github.com/rafamel/kpo/compare/v0.6.0...v0.7.0) (2019-05-19)


### Bug Fixes

* **core/paths:** gets kpo scripts file path when not in cwd and a sibling to package.json ([02b0548](https://github.com/rafamel/kpo/commit/02b0548a71776d2c1fd220a328bd02658b35ac16))
* **public/tags:** resets logger level after kpo calls ([83ed074](https://github.com/rafamel/kpo/commit/83ed074a77a699deb17b2d927ccddaf6864ead06))
* **utils/env-manager:** fixes undefined being coherced into a string when setting environment variab ([885c26d](https://github.com/rafamel/kpo/commit/885c26d926d4b265060f52d0d6be6dcd73dc55b2))


### Features

* **public/fs:** allows copy, move, remove to take promises as src ([3747dba](https://github.com/rafamel/kpo/commit/3747dbab4782e953784ebefff43a3a8884057588))
* **public/fs:** allows rw and json to take overwrite option (IFsWriteOptions) ([cc6db76](https://github.com/rafamel/kpo/commit/cc6db7676276ef36bf8175f4c390689c31a10dd7))
* **public/fs:** allows write to take a function for the file content ([4419db2](https://github.com/rafamel/kpo/commit/4419db2ff49afce78d4ea808763f9a1269588226))
* **public/fs:** makes errors occurred in user provided callbacks instances of OpenError ([a5784f5](https://github.com/rafamel/kpo/commit/a5784f5a113a6bba5d1915c43b63108cb5da308a))
* **public/tags:** adds glob tag ([69e3d9a](https://github.com/rafamel/kpo/commit/69e3d9a0d973c11ea2cbbdc740c31d1284fa66f6))



# [0.6.0](https://github.com/rafamel/kpo/compare/v0.5.2...v0.6.0) (2019-05-17)


### Bug Fixes

* **core:** sets project directory as cwd before scripts file is loaded ([9985cfd](https://github.com/rafamel/kpo/commit/9985cfd70bd86693f4e22477f0bf0adc462aca11))
* **deps:** removes semver as a dependency ([ded943f](https://github.com/rafamel/kpo/commit/ded943f41578bd941d0ec3ca1e5273ada0e8c85b))
* **deps:** updates dependencies ([87de4de](https://github.com/rafamel/kpo/commit/87de4ded7963c1c8e9f52c96d62a37a72bd3d4a0))
* **deps:** updates dependencies ([eab831b](https://github.com/rafamel/kpo/commit/eab831bd7f91252068274ec8f71367563590d731))
* **deps:** updates exits to v1 ([13594e2](https://github.com/rafamel/kpo/commit/13594e2692c137a3bf94c6aa59075a8fb73dd93d))
* **public/fs:** fixes copy types ([5446492](https://github.com/rafamel/kpo/commit/5446492426ee3ea651dda9d1108c19bce5feda45))
* **utils/logger:** prevents logger methodFactory from being registered twice ([1958d56](https://github.com/rafamel/kpo/commit/1958d566475c2f3a5039dd49d06a01945e4f2148))


### Features

* **utils/errors:** KpoError takes data as third argument; ensures isKpoError returns a boolean; imp ([b75f82c](https://github.com/rafamel/kpo/commit/b75f82c9807d0c037354873d38c991ee591360f7))



## [0.5.2](https://github.com/rafamel/kpo/compare/v0.5.1...v0.5.2) (2019-05-13)


### Bug Fixes

* **bin/attach, utils/guardian:** identifies triggered exit via environment variable to account for d ([dc77e13](https://github.com/rafamel/kpo/commit/dc77e13d0a0836168451536d3d9c06f3bb6fcb6b))
* **deps:** updates dependencies ([d5f9fa3](https://github.com/rafamel/kpo/commit/d5f9fa310a210cf3a71f78253a972536124ce638))
* **utils/env-manager:** fixes setting of default environment variables; sets empty as undefined ([9a09e8c](https://github.com/rafamel/kpo/commit/9a09e8c411ff461f36fe38a6a882bd82b34ecb74))



## [0.5.1](https://github.com/rafamel/kpo/compare/v0.5.0...v0.5.1) (2019-05-12)


### Bug Fixes

* **public/write:** fixes directory ensure ([f6d1e69](https://github.com/rafamel/kpo/commit/f6d1e692fa0ffd67092f5c9ac70239d78b1ffe06))



# [0.5.0](https://github.com/rafamel/kpo/compare/v0.4.0...v0.5.0) (2019-05-11)


### Bug Fixes

* **bin:** filters empty values for comma separated flags ([33c67dd](https://github.com/rafamel/kpo/commit/33c67ddba775b58513b7c7be417a6ae5918253e0))
* **deps:** updates dependencies ([b5bd7df](https://github.com/rafamel/kpo/commit/b5bd7df566adfdafe04a967a55ff1a7e3e90ad76))
* fixes logging level restore; initializes on reset ([48da81b](https://github.com/rafamel/kpo/commit/48da81b9a735628c5b8503886b155d4cd6021de5))
* **utils/env-manager:** fixes environment variables setting and restoring when undefined ([db4dda5](https://github.com/rafamel/kpo/commit/db4dda5e8005b2e8c877a88a19c68c53a6aada92))
* **utils/logger:** ensures methodFactory is used immediately after it is set ([2bace5a](https://github.com/rafamel/kpo/commit/2bace5a097f1c96cb4edd9e4a12a98a35253d19b))


### Features

* **commands/raise, bin/raise:** adds purge option ([626ead1](https://github.com/rafamel/kpo/commit/626ead19168662b95e60d425eb6fb5e4a88b9953))
* **public/fs:** adds read ([41b3118](https://github.com/rafamel/kpo/commit/41b3118cb99398823524a490ab784b650ecd28a7))
* uses SilentError to fail silently; logs it as warning ([f9d8ad3](https://github.com/rafamel/kpo/commit/f9d8ad39a0af768fcd52070e321ae972b819de6b))
* **utils/errors:** adds SilentError ([c72844d](https://github.com/rafamel/kpo/commit/c72844d2f70decd1896f455dc949266813c8f9eb))
* **utils/logger:** exits messages are logged w/ the same level as kpo's ones ([c4333be](https://github.com/rafamel/kpo/commit/c4333bee5a5b8523aa1a2c97e05860582f608752))



# [0.4.0](https://github.com/rafamel/kpo/compare/v0.3.0...v0.4.0) (2019-05-08)


### Bug Fixes

* **core/options:** fixes setters; doesn't call initialize on set on get; rolls back to using object ([05b6308](https://github.com/rafamel/kpo/commit/05b63087e8d65ba3ab7d9617004c3a8d06b293a8))
* **core:** uses cache relative to options.id for children and tasks ([dc9e645](https://github.com/rafamel/kpo/commit/dc9e6457734aee617755d479040f2cf59afb6c5d))
* **deps:** moves slimconf to devDependencies ([5e3c765](https://github.com/rafamel/kpo/commit/5e3c76581a03c542a8981818cb65026954d630e2))
* **public/exec:** fixes stream commands to match current globals management ([5600b8e](https://github.com/rafamel/kpo/commit/5600b8ea067795725c328c79012fa72f64a5b7f3))
* **utils/terminate-children:** replaces ps-manager w/ terminate-children; actually sents kill signal ([30dac3a](https://github.com/rafamel/kpo/commit/30dac3a94b87672953cae4ebb5d0bdff869db912))


### Code Refactoring

* **public, commands:** removes internal kpo commands from public, moves them to commands ([7acaea6](https://github.com/rafamel/kpo/commit/7acaea67559bb30817cef5aa6dcb1c4859c9d3d5))


### Features

* **bin, core:** explicitly calls initialize: ensures initialization has always happened -at least o ([b887980](https://github.com/rafamel/kpo/commit/b8879807b67b82d5a26f9f20281cac5bc2566f65))
* **bin, utils/exec:** uses exits to control spawned processes; exits w/ code 1 for signals ([572f5fe](https://github.com/rafamel/kpo/commit/572f5fe72003007849e954894bc506d38cb1e43d))
* **bin:** adds exits hook to manage child processes termination ([85b4ef8](https://github.com/rafamel/kpo/commit/85b4ef82f95cdbf63e87a6d0f2331c7be07f77dc))
* **bin:** strips out -- fromk logged command when no arguments are passed after it ([3df0061](https://github.com/rafamel/kpo/commit/3df0061b874b44ad1409ed84ee029590a3ba4e7c))
* **core, utils:** uses globals to manage core and options state; removes unused utils ([f2674d9](https://github.com/rafamel/kpo/commit/f2674d9289e569466e4a2ba4b4fa2744ddf32960))
* **core/scope:** uses only children names to identify childre; removes matcher from IChild ([685d023](https://github.com/rafamel/kpo/commit/685d023e0087a52dad9cc2f1305cc27b73bfe7f5))
* duck types errors to avoid issues w/ different instances; removes redundant error normalizatio ([97f2f8e](https://github.com/rafamel/kpo/commit/97f2f8ea9a8b42a33fed04c2fdbe79aa5af319f0))
* errors out on tasks, core, and spawned processes calls if exit has already been triggered ([201dc7a](https://github.com/rafamel/kpo/commit/201dc7aad225deeb54bad8c0cb757201f82214ca))
* **globals; utils:** globals manages environment variables; places version range validation in utils ([ba9d3d2](https://github.com/rafamel/kpo/commit/ba9d3d20ee33a790226a0446957eaff5301160c7))
* **globals:** adds globals ([b1e8f44](https://github.com/rafamel/kpo/commit/b1e8f44b06148150cfe9124091a51b8ab10e39db))
* **globals:** doesn't pollute global when process is not kpo owned ([de56134](https://github.com/rafamel/kpo/commit/de56134989e1123c6ec655a1bd5393a5c526664d))
* **public:** removes public options; kpo file, when js, should also export an options and scripts o ([1508fc4](https://github.com/rafamel/kpo/commit/1508fc4dc4765ad6ff702d2566afcfaf8fa8a91a))
* **utils/cache:** allows for getId to be null or return string or number types ([fad3fd6](https://github.com/rafamel/kpo/commit/fad3fd6dc8ac1b6c2b0fa64347cdf1fcbd55b606))
* **utils/env-manager:** adds environment variables manager ([442029b](https://github.com/rafamel/kpo/commit/442029b01d0cad6c4f923efbd7ae2c873c8681c2))
* **utils/env-manager:** adds get, set, and default methods ([b83c138](https://github.com/rafamel/kpo/commit/b83c1383ef9d968a0bb3343594b958a80a9a3f02))
* **utils/env-manager:** adds purePaths; updates initial; exports initialized manager as default ([4c27842](https://github.com/rafamel/kpo/commit/4c278423a7dc44a9420c9a05818d251b02cd2920))
* **utils/errors:** uses source as message when it's a string ([bbf86d2](https://github.com/rafamel/kpo/commit/bbf86d25da61d105183e733c9533c763fd4c52d2))
* **utils/exec, core/exec:** uses child_process spawn and fork in order to manage child processes in ([19467fa](https://github.com/rafamel/kpo/commit/19467fa9bd4e2d90626be94ce79ef7a249e6c162))
* **utils/exec:** doesn't reset paths; doesn't add paths unless options.cwd exists ([fe9da49](https://github.com/rafamel/kpo/commit/fe9da49f0ec09acc6058e549cdb03019ee6182c4))
* **utils/logger:** prefixes messages w/ level and app name ([05fce07](https://github.com/rafamel/kpo/commit/05fce07ce4277d0a0049d3709fbce71672fe88c1))
* **utils/paths:** adds getPaths ([eda621b](https://github.com/rafamel/kpo/commit/eda621b572f7287b3944587ce02c98b7615a6818))
* **utils/ps-manager:** adds child processes manager ([c90f121](https://github.com/rafamel/kpo/commit/c90f121711d39b7140fc038e9a1e8b371f82764c))
* **utils/ps-manager:** can kill processes for all children of a process ([1157ff3](https://github.com/rafamel/kpo/commit/1157ff3af26268cce96a5547ef9f48382adf8763))
* **utils:** adds guardian ([5b5e698](https://github.com/rafamel/kpo/commit/5b5e69870f6f55ce4a5dbe2a46101921738e894b))


### BREAKING CHANGES

* **public, commands:** run, list, raise, and stream are no longer exported
* **public:** doesn't further export options(); kpo file should have a scripts and options key
containing an object, even when a js file; kpo file can't export a default function



# [0.3.0](https://github.com/rafamel/kpo/compare/v0.2.0...v0.3.0) (2019-05-05)


### Bug Fixes

* **core:** doesn't preserve state when cwd has changed ([2d4d9be](https://github.com/rafamel/kpo/commit/2d4d9beaeef990573d1f9cea38776ecddaec9594))
* **public/exec:** stream arguments get passed to command ([0e96323](https://github.com/rafamel/kpo/commit/0e9632307e79e1613be4bec7a28759f869c610aa))


### Features

* **public/exec:** allows for arguments to be passed in options; arguments in options overwrite glob ([1c341ef](https://github.com/rafamel/kpo/commit/1c341efba0eca04db50063527dd5db7187e1aa2d))
* **public/kpo:** adds -- to kpo commands on raise so they can take arguments out of the box ([ef05508](https://github.com/rafamel/kpo/commit/ef055087d77e8318a4ed264960a5338752734f27))
* **utils/version-range:** returns boolean instead of throwing for mismatches ([09e9ef6](https://github.com/rafamel/kpo/commit/09e9ef6b268395fb63848089395ffded75a74f5b))



# [0.2.0](https://github.com/rafamel/kpo/compare/v0.1.0...v0.2.0) (2019-05-04)


### Bug Fixes

* **core/tasks:** fails on tasks starting with "_" ([2439812](https://github.com/rafamel/kpo/commit/2439812106a476c2fefb586482646c92dfdc6c27))
* **utils/cache:** saves only last result, otherwise side effects (options changes) won't be register ([0073f48](https://github.com/rafamel/kpo/commit/0073f48be51cea4e30dc1b5d0b00c1a43844243e))


### Features

* **core/scope:** checks for children name conflicts when inferred from directory name ([0cf24eb](https://github.com/rafamel/kpo/commit/0cf24ebea705179ececa497756b302da37021f02))
* properly passes state between kpo instances and processes via KPO_STATE env var ([4cb9957](https://github.com/rafamel/kpo/commit/4cb995745a451a4c3f8bbb3461a75b49a66cbd0b))



# [0.1.0](https://github.com/rafamel/kpo/compare/v0.0.4...v0.1.0) (2019-05-03)


### Bug Fixes

* **core/options:** setBase doesn't strip undefined values to fully preserve passed options ([479165b](https://github.com/rafamel/kpo/commit/479165b06418878a1737d323db24de9b0b1f65f2))
* **core/tasks:** fixes path parsing and printing ([51d34a3](https://github.com/rafamel/kpo/commit/51d34a3f21780bf83eea8f12d55804b141b385de))
* **core/tasks:** tries to run package.json tasks only when task is not found on kpo, but not for any ([20344a8](https://github.com/rafamel/kpo/commit/20344a861761e1ca012ae416c6b7fbb7df45b11d))
* overwrites error constructors and helpers for locally imported kpo instances ([0a420d4](https://github.com/rafamel/kpo/commit/0a420d402f4315e151a96292c08fb215d7487d7a))


### Features

* **core/load:** passes public functions if kpo scripts file exports a function ([04a93b8](https://github.com/rafamel/kpo/commit/04a93b8e17b17d9bbed9a610e9d224c893091881))
* **core:** deals with different executing and imported kpo instances ([2b7478a](https://github.com/rafamel/kpo/commit/2b7478a7d6576ebcc737eb099a32761ae8fab331))



## [0.0.4](https://github.com/rafamel/kpo/compare/v0.0.3...v0.0.4) (2019-05-02)


### Bug Fixes

* **utils/cache, core:** removes cache callback arguments ([dfbd213](https://github.com/rafamel/kpo/commit/dfbd21337f4d70fc463614529234a111337d7e76))
* **utils/confirm:** forces import of transpiled prompts ([8b752d2](https://github.com/rafamel/kpo/commit/8b752d20feacc83e8c8693be027cf99475a350c1))


### Features

* **public/fs:** takes string array as src for copy and move ([0521531](https://github.com/rafamel/kpo/commit/0521531bec6796192f7f38009dede29f4f5384e3))



## [0.0.3](https://github.com/rafamel/kpo/compare/v0.0.2...v0.0.3) (2019-05-01)


### Bug Fixes

* **public/prompts:** forces import of transpiled prompts for confirm and select ([5d5d0d3](https://github.com/rafamel/kpo/commit/5d5d0d3b2fc097810923dc22ef6bec4a68ea130c))



## [0.0.2](https://github.com/rafamel/kpo/compare/v0.0.1...v0.0.2) (2019-05-01)


### Bug Fixes

* **public/prompts:** forces transpiled prompts usage ([c7b2697](https://github.com/rafamel/kpo/commit/c7b26973acbe6a7e8ea891025cb9e24528430940))



## [0.0.1](https://github.com/rafamel/kpo/compare/91d12ab195eeb47ca387c1a46e92282e676ddd3f...v0.0.1) (2019-05-01)


### Bug Fixes

* **bin:** catches errors when getting silent option ([856c793](https://github.com/rafamel/kpo/commit/856c793e8941581721f9fb35cf0330c15babb334))
* **bin:** fixes help usage instructions ([52381ad](https://github.com/rafamel/kpo/commit/52381ad5cf67c9f21f09fb54201fc44185b0db9b))
* **commands/list:** fixes list to use core.cwd instead of core.paths ([714835c](https://github.com/rafamel/kpo/commit/714835cfa44edac8148489a30d16857495570373))
* **commands/run:** throws when task is not found ([7906ae7](https://github.com/rafamel/kpo/commit/7906ae763e35321e200c4e5847e7b51c50f50b23))
* **core/paths:** doesn't throw when root paths retrieval fails and it's not explicitly defined in op ([a7261a4](https://github.com/rafamel/kpo/commit/a7261a47bb357a450026f3e2a6d95ac64e5aaf8a))
* **core/tasks:** fixes purePath regex -default cannot be an intermediary value ([4fdef72](https://github.com/rafamel/kpo/commit/4fdef72db5a90e70f9f7a8e6fd0a563f206954d9))
* **core/tasks:** fixes task names formatting on error messages for getFromKpo ([4bf1fba](https://github.com/rafamel/kpo/commit/4bf1fbac1f70ef7c2d935b9990b7117a908fe357))
* **core/tasks:** takes IScripts being an instance of Error into account ([a19b394](https://github.com/rafamel/kpo/commit/a19b394edc402f1e806de7ae89ae8c73a24c84e2))
* **core:** ensures options have been loaded when requesting options; makes options part of core ([492c737](https://github.com/rafamel/kpo/commit/492c737de69098ed6b4d92222dca13232bb43f98))
* **deps:** adds missing dependency js-yaml; removes dangling ([a3a8183](https://github.com/rafamel/kpo/commit/a3a8183f6f91acdb05fd2e9358f678de21f9ba22))
* **deps:** updates errorish to v0.2.0 ([0c2e4fa](https://github.com/rafamel/kpo/commit/0c2e4fa3e78a65e45dc258c3f521582b74228186))
* **deps:** updates errorish to v0.2.1 ([cc8db44](https://github.com/rafamel/kpo/commit/cc8db44995ab9265cca00c3727921dec3ab99c44))
* **deps:** updates errorish to v0.3.0 ([a576f09](https://github.com/rafamel/kpo/commit/a576f094e866988cb47546edd89675d9d7725b85))
* **exposed/fs:** fixes copy, destination existence should be recursively evaluated, hence handled by ([6e709b8](https://github.com/rafamel/kpo/commit/6e709b8f3f663188e8d5b567d7597867ed37475e))
* **exposed/fs:** fixes relative paths ([0513950](https://github.com/rafamel/kpo/commit/0513950b4990ce8e37966604a78a0f15a1291da3))
* **exposed/line:** fixes tag typings ([9f33f15](https://github.com/rafamel/kpo/commit/9f33f15227c2ab754f56ba49142a80c3494ae5bb))
* **exposed/tags:** fixes silent ([f0ac3ea](https://github.com/rafamel/kpo/commit/f0ac3ea10ea4fb455da103f85bd63b876255ef37))
* **exposed:** uses core.cwd() instead of core.paths() to determine cwd ([dd02f9c](https://github.com/rafamel/kpo/commit/dd02f9cb12acf941d7f317826896b355a56b3ed0))
* **ore/tasks:** fixes error message at getFromKpo ([b3d9d43](https://github.com/rafamel/kpo/commit/b3d9d43291fc4853deadf50963a5fbf29c9dd247))
* **public/exec:** fixes parallel args ([7c2b0ea](https://github.com/rafamel/kpo/commit/7c2b0ea58da503b213a3605f139635f9f281ab0e))
* **public/exec:** fixes series.fn types ([5b72565](https://github.com/rafamel/kpo/commit/5b72565a457195075fc07e8c5ee297148e3c0a1b))
* **public/fs:** fixes rw fs.ensureDir call ([9fad602](https://github.com/rafamel/kpo/commit/9fad602a5ad25c7dc1b6d958fcf28e0cd053c5d8))
* **state/paths:** converts root directory path to absolute, if needed ([aad9f6e](https://github.com/rafamel/kpo/commit/aad9f6e9532f8dd5eeee5862f06d3a7cc5cf7167))
* **state/paths:** fixes directory normalization and equality evaluation ([2f5fc9b](https://github.com/rafamel/kpo/commit/2f5fc9b0eb2e8347c42018390c122e58e6657f6e))
* **state/paths:** get paths root scope recursively from directory ([05c6d31](https://github.com/rafamel/kpo/commit/05c6d31839f78ab68645f6feee803f84343fb722))
* **state:** fixes state merging ([c146b7b](https://github.com/rafamel/kpo/commit/c146b7b9d55045492e950a7005383d89a2bfd7ea))
* uses WrappedError constructor when an error overwrite is intended ([f72b5a7](https://github.com/rafamel/kpo/commit/f72b5a7f1170af0fefe268e02066877f9ef5b005))
* **utils/as-tag:** only considers arguments as coming from a template literal if their number matche ([c494a08](https://github.com/rafamel/kpo/commit/c494a0805796b3f647723c10630ba1c79566eb94))
* **utils/errors:** fixes wrap configuration to always overwrite message ([dc341f4](https://github.com/rafamel/kpo/commit/dc341f4ff020b0998c49cf95c924d42eaafa750c))
* **utils/file:** fixes exists to return void as per typings ([6776e59](https://github.com/rafamel/kpo/commit/6776e5947ce7b32bf00c3b4196e7ffd4a6f8d39a))


### Features

* adds optional name field to IChild ([6596a1e](https://github.com/rafamel/kpo/commit/6596a1e4db2cf52d58ea157a1bc855cb7bb6e424))
* **bin, commands:** adds list ([1a6bd2a](https://github.com/rafamel/kpo/commit/1a6bd2a1e4fac3da58732b7b899648d8acfa3318))
* **bin/kpo:** exists w/ code 1 only if not silent ([610420e](https://github.com/rafamel/kpo/commit/610420e1fc1deee49afd595bdc038624ee37c04c))
* **bin/list, commands/list:** lists scopes ([14306a3](https://github.com/rafamel/kpo/commit/14306a3ca80edf55a7e960a74450df82e0b06ba1))
* **bin/main:** updates base state w/ cli options ([2e49b5e](https://github.com/rafamel/kpo/commit/2e49b5ec3229e6433b2e75347a21c47002330030))
* **bin:** adds cmd ([bb50bf9](https://github.com/rafamel/kpo/commit/bb50bf90903720eca21d0373c2256e0bf954e17f))
* **bin:** adds kpo bin and main ([eb0774b](https://github.com/rafamel/kpo/commit/eb0774b3c851141dbfe41e0b2b8f8215128e2bf4))
* **bin:** adds parallel ([1c4098e](https://github.com/rafamel/kpo/commit/1c4098e01134df2cf3a19726259cd2f5aa2d5606))
* **bin:** adds raise ([583c6ad](https://github.com/rafamel/kpo/commit/583c6ad97f401f35e3b769a6e70e09f90e4183f5))
* **bin:** adds scopes logic ([4d9f822](https://github.com/rafamel/kpo/commit/4d9f822285fddc3f9312e8090f70b59c9a9d3786))
* **bin:** adds series ([d38be22](https://github.com/rafamel/kpo/commit/d38be222d0d425eb9c14853cb0db71f777e3dd21))
* **bin:** adds stream ([a402da5](https://github.com/rafamel/kpo/commit/a402da5658e48321c80a17d9f58176620e364a86))
* **bin:** ensures param is an Error before logging ([5985ff9](https://github.com/rafamel/kpo/commit/5985ff9fbe395ffa26e11c55490c1a274c60897b))
* **bin:** improves parallel and series help prompt ([dc38d92](https://github.com/rafamel/kpo/commit/dc38d92d7278e28346b1cd42f862eb8473ef18ed))
* **bin:** logs full command to be run w/ resolved scopes ([4fc97bc](https://github.com/rafamel/kpo/commit/4fc97bc2d5d8042389d4253e6f7f1e0148500c40))
* **bin:** removes --node argument ([cc072b9](https://github.com/rafamel/kpo/commit/cc072b9ed15a5a7bac9355ad09da2250fb344be9))
* **bin:** uses commands/run ([b31e3a7](https://github.com/rafamel/kpo/commit/b31e3a704a780ae333af5bcf59cb9d4d0de3885a))
* **commands/run:** gets default key for task if it exists ([2787459](https://github.com/rafamel/kpo/commit/2787459ad9a7dc2546ab5e12314f8a562d8508ba))
* **commands:** adds run ([86d40b5](https://github.com/rafamel/kpo/commit/86d40b5c7360703a3fe3b24986c450e85acafb64))
* **core/load:** gets scripts key and sets options from options key from kpo scripts file if not a j ([5c54850](https://github.com/rafamel/kpo/commit/5c548506cc6c0e61c29ec25f5a4ccb83a0643e11))
* **core/options:** adds forceUpdate ([1dd5648](https://github.com/rafamel/kpo/commit/1dd5648bd090584b209c1c58b3f26f0af5c8484b))
* **core/options:** allows directory to also be defined at IScopeOptions ([8b0f221](https://github.com/rafamel/kpo/commit/8b0f221af0b4b6407fcd7425254242ab45318943))
* **core/options:** gives priority to cli options ([c9a2b5b](https://github.com/rafamel/kpo/commit/c9a2b5beb3ce6de5496a6b6c81cbac98c78b5c98))
* **core/options:** uses object hash to identify options ([fcd9122](https://github.com/rafamel/kpo/commit/fcd9122765e52060be03eccf44df82b83370dad2))
* **core/scope:** recurses up to [@root](https://github.com/root) looking for children scopes ([c3640b0](https://github.com/rafamel/kpo/commit/c3640b0189d2e2fa1460e149bee16211a97e5be3))
* **core/tasks:** adds tasks to core ([de93899](https://github.com/rafamel/kpo/commit/de9389986f7eae7af63860f5b6a500a7ff2f6ae7))
* **core:** adds children to core entry ([95bda68](https://github.com/rafamel/kpo/commit/95bda68f2be075ddf58f3bc9ca749469dd465c7e))
* **core:** adds cwd option for IScopeOptions; improves type definitions for package, cli, and core ([63766bc](https://github.com/rafamel/kpo/commit/63766bc99606587ff2cb9176f965712666b0d9c1))
* **core:** adds run ([7ca5479](https://github.com/rafamel/kpo/commit/7ca5479a7b953b31209d811f648046f59155378d))
* **core:** allows exec to take cwd and env options ([757559c](https://github.com/rafamel/kpo/commit/757559c439ba4ec7c8b30a12a3e9b99d5111a456))
* **core:** allows options to be defined at kpo package.json key ([6297145](https://github.com/rafamel/kpo/commit/6297145f847e925868962a47849aeee0cfe68ef9))
* **core:** allows relative paths as cwd on exec ([a294f8b](https://github.com/rafamel/kpo/commit/a294f8b0221ba429d839c87ef21708ddcf5cd863))
* **errors:** adds CustomError and WrappedError ([06e7010](https://github.com/rafamel/kpo/commit/06e7010628050059bdb7db9691643957c1d6873e))
* **exposed/exec:** adds series.env and parallel.env ([063fcba](https://github.com/rafamel/kpo/commit/063fcba34fef227176ed669b181a813f89911bb5))
* **exposed/exists:** adds exists ([758ad8d](https://github.com/rafamel/kpo/commit/758ad8de5c2766c32e341e4361c536c2357517d7))
* **exposed/file:** adds json ([6e7efb2](https://github.com/rafamel/kpo/commit/6e7efb271946ed28d1f024efb55f5114d3556421))
* **exposed/file:** adds remove ([75d114f](https://github.com/rafamel/kpo/commit/75d114f2cdd7b79bea0bd2d1dee5f0df1a8a4630))
* **exposed/fs, exposed/tags:** adds mkdir; uses mkdir on ensure ([6109bf8](https://github.com/rafamel/kpo/commit/6109bf8cb8b98a9fbb2f6070d5c07b4554c27638))
* **exposed/fs:** adds copy ([9a5c313](https://github.com/rafamel/kpo/commit/9a5c31386c9663e05c5bfa28b55e70d452e8bc19))
* **exposed/fs:** adds move ([0acf5a5](https://github.com/rafamel/kpo/commit/0acf5a5c67dc348010dd8a1f767da0d24ae59cb7))
* **exposed/fs:** adds write ([8706280](https://github.com/rafamel/kpo/commit/8706280a0abe79551c625b119a47597b9232d625))
* **exposed/fs:** improves logger messages ([98d3474](https://github.com/rafamel/kpo/commit/98d347481276aa124272861b50490d8552f9c205))
* **exposed/fs:** moves file to fs; improves functions implementation and typings; adds rw ([3a235cd](https://github.com/rafamel/kpo/commit/3a235cdb3ef3ac8c53fa3a3448dac69d2cb12a50))
* **exposed/prompts:** adds select prompt ([71cdfa7](https://github.com/rafamel/kpo/commit/71cdfa7cb9d26575d3bfaaf0c82a76f5571059d2))
* **exposed/prompts:** confirm shows timeout if passed ([316da0e](https://github.com/rafamel/kpo/commit/316da0e7c7fd73874901e79b3ba66a4d72b97dc1))
* **exposed/tags:** adds ensure ([28adb76](https://github.com/rafamel/kpo/commit/28adb7644d521d0ffff060f08ec55f7d86127bd7))
* **exposed/tags:** adds exists ([2808b7c](https://github.com/rafamel/kpo/commit/2808b7cab6e7ab479e06b8f993ca100c0ac5cbe3))
* **exposed/tags:** adds log ([c9b3a1c](https://github.com/rafamel/kpo/commit/c9b3a1cec392aa8cd73050146e788ae1fc55401e))
* **exposed/tags:** adds rm ([aba9763](https://github.com/rafamel/kpo/commit/aba9763d0f4e065c8603b19a456d32d09032d247))
* **exposed:** adds confirm prompt ([76f99e5](https://github.com/rafamel/kpo/commit/76f99e5b06f3d42ed9d55767b9168d56928f6704))
* **exposed:** adds exposed w/ options ([a65f650](https://github.com/rafamel/kpo/commit/a65f6501090ff203536623d3d0a481033411f376))
* **exposed:** adds parallel ([9a735f6](https://github.com/rafamel/kpo/commit/9a735f688b2daba143e4e8218ed65b34210d4941))
* **exposed:** adds series ([dcdb7c7](https://github.com/rafamel/kpo/commit/dcdb7c7bd382ff7c3936a9e67bd0e4831268cd24))
* **exposed:** adds silent ([312c676](https://github.com/rafamel/kpo/commit/312c676d78bc304a18c9b9979ff2986df2cf8d51))
* **exposed:** adds trim ([164e7eb](https://github.com/rafamel/kpo/commit/164e7ebecfe3341957a6f211c9a17e580d89f30c))
* **exposed:** replaces trim w/ line -adds line ([7d3baab](https://github.com/rafamel/kpo/commit/7d3baab010967b357745b8d368cdb8d2827071e0))
* **exposed:** wraps all exposed fns errors as WrappedError, so their stacktrace doesn't get logged ([ec911e3](https://github.com/rafamel/kpo/commit/ec911e34382835474fc3e8b80fa78699afe7c7c2))
* improves logged messages ([d1c7751](https://github.com/rafamel/kpo/commit/d1c775191ff3f549427286a632ccb7b97974df97))
* **options:** implements and exports options from entry point ([3f0ae47](https://github.com/rafamel/kpo/commit/3f0ae477a407b51fa3c537ceb679945d24440321))
* **parse/load:** returns package.json and redesigns getFile ([23480a7](https://github.com/rafamel/kpo/commit/23480a793b74c2cd130213f778697feb8333d6dd))
* **parse:** adds getFile ([4da7cd9](https://github.com/rafamel/kpo/commit/4da7cd90f5e6f411d178e611c8bb85251c0661ec))
* **parse:** adds readFile and IScripts type ([1cd195c](https://github.com/rafamel/kpo/commit/1cd195c02e96b96ce8a9c1e620f5ececef1b9a52))
* passes arguments to tasks, both for commands and functions ([18042df](https://github.com/rafamel/kpo/commit/18042df89d7aa313e8ad4aca2373b90856a29a8a))
* **public/exec:** adds stream ([76da0d0](https://github.com/rafamel/kpo/commit/76da0d0379c89377327dfe759249d02e07894cb0))
* **public/kpo:** adds raise ([4408633](https://github.com/rafamel/kpo/commit/4408633066599c494657b596b0700412ab0a9555))
* **public/kpo:** takes scripts to replace into account on raise ([33e0e83](https://github.com/rafamel/kpo/commit/33e0e83c8e92ac8a5551e8902d2c7cc186f78f8b))
* **state/load:** sets cwd as default directory ([f673347](https://github.com/rafamel/kpo/commit/f673347f3936bad69ede0f3e74fb3814a859b995))
* **state/paths:** retrieves bin paths recursively for current and root scopes ([a92997e](https://github.com/rafamel/kpo/commit/a92997e95eed7dc05839209093fb8ac2d3e1987f))
* **state/scope:** adds getChildren ([9fb9ddf](https://github.com/rafamel/kpo/commit/9fb9ddf7361578bd30ba91e5416fb8b156b6b837))
* **state:** adds paths ([96fd89b](https://github.com/rafamel/kpo/commit/96fd89b8a0eb4b4ef654af16e6cd6ebe4ffdad56))
* **state:** adds scope ([c691501](https://github.com/rafamel/kpo/commit/c69150168dd826728984e862f82b5b129dc199ea))
* **state:** adds state, moves parse/load ([aba1998](https://github.com/rafamel/kpo/commit/aba199833d909163e10c493467a0f3d8a40d76fd))
* **state:** allows root scope to be set as null ([87e80b9](https://github.com/rafamel/kpo/commit/87e80b9f6db8efcec6af3b06cbeb2c70e5161d66))
* **state:** get unsafely retrieves values for keys ([cb6a334](https://github.com/rafamel/kpo/commit/cb6a334605d323383e35e4026edd16e94e3c87bc))
* **state:** separates load into paths and load; gets root paths ([ea2b809](https://github.com/rafamel/kpo/commit/ea2b80984936568ff89cb42bbd53a86ee4cfbbdf))
* **state:** sets logger level on state merging ([7e7e190](https://github.com/rafamel/kpo/commit/7e7e190254f8bcfd8966af06a51f254f41ad6270))
* **types:** allows circular renference as Array and falsy values for TScript ([657ad24](https://github.com/rafamel/kpo/commit/657ad241c82cab7f1817bbd473cc8ce4b6ce6866))
* **types:** improves TScript typings ([57bfc0c](https://github.com/rafamel/kpo/commit/57bfc0c435ddaf2ffaf3aa2c411fe62c5014ba31))
* **types:** separates IOptions into IBaseOptions and IScopeOptions; ensures IBaseOptions are preser ([78d5fd7](https://github.com/rafamel/kpo/commit/78d5fd77298cf4626b6cf8397030bb04df6d0ff0))
* uses OpenError to log full errors as long as logger is not silent when it ocurrs on task funct ([282fdfc](https://github.com/rafamel/kpo/commit/282fdfc728b9603ba028dda1b2da9254327a253f))
* **utils/errors:** adds custom name getter for error classes ([3a5191b](https://github.com/rafamel/kpo/commit/3a5191b33923600b58076768ef77c471d2bb60b1))
* **utils/exec, core/exec:** adds forking capability to exec ([5e4aa6a](https://github.com/rafamel/kpo/commit/5e4aa6a8d5ed7adff7c524eef4aa396f11224416))
* **utils/exec:** adds exec ([74e1ed2](https://github.com/rafamel/kpo/commit/74e1ed258dbe61617b77c41f52e4d3bd6935e29d))
* **utils/exec:** kills dangling child processes on main process exit ([f955538](https://github.com/rafamel/kpo/commit/f9555381a7f541ecc61e2ef7d2422dc647cea4b0))
* **utils/exec:** passes environment variables w/ state envs and paths by default; returns a promise ([6ed1eef](https://github.com/rafamel/kpo/commit/6ed1eef74499b754cf5efcd1a336bb46e8397353))
* **utils/exec:** sets options as optional ([0f68e72](https://github.com/rafamel/kpo/commit/0f68e72f60cab043425fc8450c8269f3654a85ce))
* **utils/exec:** spawns w/ project directory as cwd ([ab692bc](https://github.com/rafamel/kpo/commit/ab692bcaab851aa963750909566d3a98ed4c2b2b))
* **utils/file:** adds absolute ([69532e0](https://github.com/rafamel/kpo/commit/69532e02b3797bf95eb1e672061f6adde22b8f00))
* **utils/file:** adds load ([e9f823f](https://github.com/rafamel/kpo/commit/e9f823fef643ac76c22bcc30ee4fce6d2c6d6b39))
* **utils/logger:** adds logger ([78676b4](https://github.com/rafamel/kpo/commit/78676b4f8a9d2d6a4c96fadd13a4787b2516873c))
* **utils:** adds asTag ([87eae18](https://github.com/rafamel/kpo/commit/87eae18721ef182940ef0a46095e00fe9dd12ed3))
* **utils:** adds confirm ([fc40be3](https://github.com/rafamel/kpo/commit/fc40be36de2ba672f4bb21c76d6d50d3e6e65cda))
* **utils:** adds ensure ([91d12ab](https://github.com/rafamel/kpo/commit/91d12ab195eeb47ca387c1a46e92282e676ddd3f))
* **utils:** adds expose ([a3ba5ca](https://github.com/rafamel/kpo/commit/a3ba5cab6a79980a776c7a7bf14623a8b8033001))
* **utils:** adds file utils ([c8b5c75](https://github.com/rafamel/kpo/commit/c8b5c756f9ba21f0e5ac4ec64246cf73b9954694))
* **utils:** adds memoize ([24212ed](https://github.com/rafamel/kpo/commit/24212eddeb6fc5b2c9ad11450268d9eb61f7aa81))
* **utils:** adds open ([4ceb22b](https://github.com/rafamel/kpo/commit/4ceb22bbfb9ca93acc6f808b93e58a4ca5bcef12))
* **utils:** substitutes memoize w/ cache; cache now takes a getId function to identify state ([d2cc870](https://github.com/rafamel/kpo/commit/d2cc870dcecd67b1d8084e668a614d10c81e81ca))



