module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'config',
        'database',
        'user',
        'auth',
        'room',
        'equipment',
        'booking',
        'payment',
        'review',
        'queue',
        'test',
        'shared',
        'env',
        'docker',
      ],
    ],
  },
};
