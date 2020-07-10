module.exports = {
  "npm": {
    "publish": true
  },
  "git": {
    "changelog": "npx auto-changelog --stdout --commit-limit false --unreleased --template config/changelog-compact.hbs",
    "commitMessage": "chore(build): release v${version}"
  },
  "github": {
    "release": true,
    "assets": ["dist/**/*.gz"]
  },
  "hooks": {
    "before:init": ["npm test"],
    "after:bump": [
      // "npx auto-changelog -p",
      "npm run build",
    ]
  }
}
