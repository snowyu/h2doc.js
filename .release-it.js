module.exports = {
  "npm": {
    "publish": false
  },
  "git": {
    "commitMessage": "chore(build): release v${version}"
  },
  "github": {
    "release": true,
    "assets": ["dist/**/*.gz"]
  }
}
