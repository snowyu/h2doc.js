import Debug from 'debug';

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

const debug = Debug('h2doc:meta');

import got from 'got';
// const got = require('got');

export async function getMetadata(targetUrl: string, _aHtml?: string) {
  const { body: html, url } = await got(targetUrl);
  debug('url:', url);
  let metadata;
  try {
    metadata = await metascraper({ html, url });
  } catch (e) {
    debug('getMetadata error:', e);
    metadata = { url: targetUrl };
  }
  debug('data:', metadata);
  return metadata;
}
