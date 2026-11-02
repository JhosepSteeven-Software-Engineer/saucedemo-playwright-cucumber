const fs = require('node:fs');

for (const dir of ['reports', 'reports/traces', 'reports/screenshots']) {
  fs.mkdirSync(dir, { recursive: true });
}

const common = {
  paths: ['features/**/*.feature'],
  requireModule: ['tsx/cjs'],
  require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    'junit:reports/junit.xml',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  parallel: 1,
  strict: true,
};

module.exports = {
  default: common,
  smoke: {
    ...common,
    tags: '@smoke',
  },
  regression: {
    ...common,
    tags: '@regression',
  },
  ci: {
    ...common,
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'junit:reports/junit.xml',
    ],
  },
};
