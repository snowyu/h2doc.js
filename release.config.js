module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/github',
      {
        assets: [['!dist/deb/Packages.gz', 'dist/**/*.{gz,deb,exe}']],
      },
    ],
  ],
};
