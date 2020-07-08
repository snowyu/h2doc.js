const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-video')(),
  require('metascraper-audio')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
  // require('metascraper-readability')(),
]);

import got from 'got';
// const got = require('got');

export async function getMetadata(targetUrl: string) {
  const {body: html, url} = await got(targetUrl);
  const metadata = await metascraper({html, url});
  return metadata;
}
