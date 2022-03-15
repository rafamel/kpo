const riseup = require('./riseup.config.cjs');

module.exports = ({
  recreate,
  context,
  create,
  series,
  lift,
  exec,
  catches,
  mkdir,
  remove
}) => {
  const tasks = {
    node: riseup.node,
    build: series(
      mkdir('build', { ensure: true }),
      remove('build/*', { glob: true, recursive: true }),
      exec('tsup')
    ),
    tarball: riseup.tarball,
    docs: riseup.docs,
    fix: riseup.fix,
    lint: series(riseup.lintmd, riseup.lint),
    test: riseup.test,
    commit: riseup.commit,
    release: context({ args: ['--no-verify'] }, riseup.release),
    distribute: riseup.distribute,
    validate: series(
      create(() => tasks.lint),
      catches({ level: 'silent' }, exec('npm', ['outdated']))
    ),
    /* Hooks */
    version: series(
      create(() => tasks.validate),
      create(() => tasks.build),
      create(() => tasks.docs)
    )
  };

  return recreate({ announce: true }, tasks);
};
