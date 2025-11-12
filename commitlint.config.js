module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'feat',     // New feature
          'fix',      // Bug fix
          'docs',     // Documentation
          'style',    // Formatting
          'refactor', // Code restructuring
          'test',     // Tests
          'chore',    // Maintenance
          'perf',     // Performance
          'ci',       // CI/CD
          'build',    // Build system
          'revert',   // Revert commit
        ],
      ],
    },
  };