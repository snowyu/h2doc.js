module.exports = {
  "npm": {
    "publish": true
  },
  "git": {
    "requireCleanWorkingDir": false,
    "changelog": "npx auto-changelog --stdout --commit-limit false --unreleased --template config/changelog-compact.hbs",
    "commitMessage": "chore(build): release v${version}"
  },
  "github": {
    "release": true,
    "assets": ["dist/**/*.{gz,deb,exe}"]
  },
  "hooks": {
    "before:init": ["sudo rm -fr tmp dist", "npm test"],
    "after:bump": [
      // "npx auto-changelog -p",
      "npm run build",
    ]
  }
}
