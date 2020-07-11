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
    "assets": ["dist/**/*.gz"]
  },
  "hooks": {
    "before:init": ["npm test", "sudo rm -fr tmp dist"],
    "after:bump": [
      // "npx auto-changelog -p",
      "npm run build",
    ]
  }
}
