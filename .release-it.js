module.exports = {
  "npm": {
    "publish": true
  },
  "git": {
    "commitMessage": "chore(build): release v${version}"
  },
  "github": {
    "release": true,
    "assets": ["dist/**/*.gz"]
  }
}
