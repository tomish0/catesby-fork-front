var remote = true;

var spiritbunker = "https://api.spiritbunker.com";

var localhost = "http://localhost:5000";

var domain;

if (remote) {
  domain = spiritbunker;
} else {
  domain = localhost;
}

module.exports = { domain };
