/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * @flow
 */
// const adsSdk = require('facebook-js-ads-sdk');
import FacebookAdsApi from './api';
import Ad from './objects/ad';
import AdAccount from './objects/ad-account';
import Campaign from './objects/campaign';
const accountId = 'act_14371854';
const accessToken = 'EAAacaRAy0A0BAAZBpa5y6PXok3Km4o8dJJhJNl9wKPl8hJKc5IeCxqbNFuWymd4b6tQBCjckcojJmzDsSYZBoUZAS5EYX4dk82PSGVFN820sQxb2L1Is0X4TWMG4jyHq2l8QmlZCzUDZCdDC0OE5qmp5mZBBO699j9ARrZAqTDcyVmwZAHUAWGfeQZABaG96sRDoZD';
const api = FacebookAdsApi.init(accessToken);
const account = new AdAccount(accountId);
const showDebugingInfo = false;
if (showDebugingInfo) {
  api.setDebug(true);
}

const errorFunction = (scenarioName: string) => {
  let returnFunction = (error) => {
    console.log('An error occurred while processing, ' + scenarioName);
    console.log('Error Message:' + error);
    console.log('Error Stack:' + error.stack);
  };
  return returnFunction;
};

const logPassedTest = (testName, data) => {
  console.log(testName);
  if (showDebugingInfo) {
    console.log('Data:' + JSON.stringify(data));
  }
};

let test1 = 'Node.js read';
account
  .read([AdAccount.Fields.name, AdAccount.Fields.age])
  .then((account) => {
    logPassedTest(test1 + ':Pass', account);
  })
  .catch(errorFunction(test1));

let test2 = 'Node.js get active ads';
account
  .getAds(
    [],
  {
      [Ad.Fields.effective_status]: [Ad.EffectiveStatus.active]
  })
  .then((ad) => {
    logPassedTest(test2 + ':Pass', ad);
  })
  .catch(errorFunction(test2));

let test3 = 'Node.js getInsights Edge';
const campaignId = 6077675487261;
const insightsFields =
  ['impressions', 'frequency', 'unique_clicks', 'actions', 'spend', 'cpc'];
new Campaign(campaignId)
  .getInsights(insightsFields, {})
  .then((insight) => { logPassedTest(test3 + ':Pass', insight); })
  .catch(errorFunction(test3));

let test4 = 'Node.js nestedCalls';
account.read([AdAccount.Fields.name])
.then((account) => {
  logPassedTest(test4 + '-GetAdAcccount:Pass', account);
  return account.getCampaigns([Campaign.Fields.name], { limit: 10 });
})
.then((result) => {
  logPassedTest(test4 + '-GetCampaigns:Pass', result);
  const campaignIds = result.map((campaign) => {
    return campaign.id;
  });
  const campaignAdsInsightsParams = Object.assign({
    level: 'campaign',
    filtering: [{ field: 'campaign.id', operator: 'IN', value: campaignIds }]
  }, {});
  const campaigsAdsInsightsFields = insightsFields.concat('campaign_id');
  return account
    .getInsights(campaigsAdsInsightsFields, campaignAdsInsightsParams);
})
.then((insights) =>
  logPassedTest(test4 + '-GetCampaignInsights:Pass', insights)
)
.catch(errorFunction(test4));

let test5 = 'Create Edge';
account
  .createCampaign(
    [],
    {
      [Campaign.Fields.name]: 'Test Campaign - Delete',
      [Campaign.Fields.status]: Campaign.Status.paused,
      [Campaign.Fields.objective]: Campaign.Objective.page_likes
    }
  )
  .then((campaign) => {
    logPassedTest(test5 + ':Pass', account);
  })
  .catch(errorFunction(test5));

  let test6 = 'Delete Image Edge';
  account
  .createAdImage(
    [],
    {
      'bytes': 'iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAAOVBMVEX///87WZg7WZg7WZg7WZg7WZg7WZg7WZg7WZg7WZg7WZhMeMJEaa5Xi9tKdb0+Xp5Wi9tXjNxThNH+wk/7AAAACnRSTlMAsHIoaM7g/fx9Zr/g5QAAAGlJREFUeNplkFsOwCAIBPGJrtbX/Q/bqm1qwnxuJrBAE6OVD15pQy/WYePsDiIjp9FGyuC4DK7l6pOrVH4s41D6R4EzpJGXsa0MTQqp/yQo8hhHMuApoB1JQ5COnCN3yT6ys7xL3i7/cwMYsAveYa+MxAAAAABJRU5ErkJggg==',
    }
  )
  .then((result) => {
    logPassedTest(test6 + ':Pass', account);
    return account.deleteAdImages(
      {
        'hash': result.images.bytes.hash
      }
    );
  })
  .catch(errorFunction(test6));

let test7 = 'CRUD Campaign';
let campaignIdToDelete;
account
  .createCampaign(
    [Campaign.Fields.status],
    {
      [Campaign.Fields.name]: 'Test Campaign - Delete',
      [Campaign.Fields.status]: Campaign.Status.paused,
      [Campaign.Fields.objective]: Campaign.Objective.page_likes
    }
  )
.then((campaign) => {
  logPassedTest(test7 + '-Create:Pass', campaign);
  campaignIdToDelete = campaign.id;
  return new Campaign(campaign.id)
  .read([Campaign.Fields.id, Campaign.Fields.name, Campaign.Fields.objective]);
})
.then((campaign) => {
  logPassedTest(test7 + '-Read:Pass', campaign);
  return new Campaign(campaign.id, {
    [Campaign.Fields.id]: campaign.id,
    [Campaign.Fields.name]: 'Test Campaign - Updated' })
    .update();
})
.then((campaign) => {
  logPassedTest(test7 + '-Update:Pass', campaign);
  return new Campaign(campaignIdToDelete)
  .delete();
})
.then((result) => {
  logPassedTest(test7 + '-Delete:Pass', result);
})
.catch(errorFunction(test7));


let test8 = 'Pagination Campaign';
account.getCampaigns([Campaign.Fields.name], { limit: 2 })
.then((campaigns) => {
  logPassedTest(test8 + '-GetCampaign:Pass', campaigns);
  if (campaigns.length === 2 && campaigns.hasNext()) {
    return campaigns.next();
  } else {
    Promise.reject(
      new Error('campaigns length != 2 or not enough campaigns')
    );
  }
})
.then((campaigns) => {
  logPassedTest(test8 + '-NextCampaign:Pass', campaigns);
  if (campaigns.hasNext() && campaigns.hasPrevious()) {
    return campaigns.previous();
  } else {
    Promise.reject(
      new Error('previous or next is not true')
    );
  }
  return campaigns.previous();
})
.then((campaigns) => {
  logPassedTest(test8 + '-PreviousCampaign:Pass', campaigns);
})
.catch(errorFunction(test8));
