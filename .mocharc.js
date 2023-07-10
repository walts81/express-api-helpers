module.exports = {
  timeout: 999999,
  colors: true,
  recursive: true,
  fullTrace: true,
  bail: true,
  spec: 'src/**/*.spec.ts',
  require: [
    'ts-node/register',
    'source-map-support/register'
  ]
}
