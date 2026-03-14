const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config({ path: path.join(__dirname, '.env') });

const checkGoogleSafeBrowsing = require('./services/googleSafeBrowsingService');
const checkPhishTank = require('./services/phishTankService');
const checkUrlscan = require('./services/urlscanService');

const testUrl = 'http://testsafebrowsing.appspot.com/s/phishing.html';

async function test() {
  const results = {};

  console.log('Testing Providers...');
  
  try {
    results.gsb = await checkGoogleSafeBrowsing(testUrl);
  } catch (e) {
    results.gsb_diag = { message: e.message, data: e.response?.data };
  }

  try {
    results.phishtank = await checkPhishTank(testUrl);
  } catch (e) {
    results.phishtank_diag = { message: e.message, data: e.response?.data };
  }

  try {
    results.urlscan = await checkUrlscan(testUrl);
  } catch (e) {
    results.urlscan_diag = { message: e.message, data: e.response?.data };
  }

  fs.writeFileSync('diagnostic_results.json', JSON.stringify(results, null, 2));
  console.log('Results written to diagnostic_results.json');
}

test();
