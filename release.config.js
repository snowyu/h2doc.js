module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'master',
    'next',
    'next-major',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'npm run build', // echo ${nextRelease.version}
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [['!dist/deb/Packages.gz', 'dist/**/*.{gz,deb,exe}']],
      },
    ],
  ],
};
