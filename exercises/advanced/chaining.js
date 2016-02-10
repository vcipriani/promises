/******************************************************************
 *                  Advanced Promise Chaining                     *
 ******************************************************************/

var Promise = require('bluebird');
var lib = require('../../lib/advancedChainingHelpers.js');

/**
 * Your task is to write a function that uses a deep learning
 * algorithm to determine the common set of tags between
 * multiple github profile pictures
 * 
 * Given an array of github handles, searchCommonTagsFromGitHubProfiles should:
 *   1) get the public profile associated with each handle
 *   2) extract the avatar_url of each profile
 *   4) get the set of tags for each avatar_url (requires authentication)
 *   5) find the intersection of the tags
 * 
 * Don't worry, much of the heavy lifting has been done already
 * in the `lib` module. You just have to wire everything up together!
 * Here's a list of methods you can access:
 * 
 *   authenticateImageTagger() =>
 *     @return {Promise} - resolves with the token required for tagImage()
 * 
 *   getGitHubProfile(handle) =>
 *     @param {String} handle - the handle of a GitHub user
 *     @return {Promise} - resolves with the user's profile in the following format:
 *       {
 *         handle: 'danthareja',
 *         name: 'Dan Thareja', 
 *         avatarUrl: 'https://avatars.githubusercontent.com/u/6980359?v=3.jpg'
 *       }
 * 
 *   tagImage(imageUrl, token) =>
 *     @param {String|Array} imageUrl - the url(s) of the image you want to tag
 *     @param {String} token - the authentication token
 *     @return {Promise} - resolves with an array of tags
 *        If imageUrl is a string, expect a single array of tags
 *        If imageUrl is an array, expect a nested array of tas
 * 
 *   getIntersection(arrays) =>
 *     @param {Array} arrays - an array of arrays, each containing a set of values
 *     @return {Array} - a single array with the intersection of values from all arrays
 * 
 * Once you pass this one, you'll be a promise chaining master! Have fun!
 * Hint: Bluebird's collection methods could prove handy here
 */

// We're using Clarifai's API to recognize different an image into a list of tags
// Visit the following url to sign up for a free account
//     https://developer.clarifai.com/accounts/login/?next=/applications/
// Then, create a new Application and pass your Client Id and Client Secret into the method below
lib.setImageTaggerCredentials('bl9m8IOnvUWWh-2eop-0aUgIsYRZmSNdBk77jxCq', 'YvtIYPWxUUHoBA0EX06yI6WYKNfWL4SzcJtEg2Bf');

var searchCommonTagsFromGitHubProfiles = function(githubHandles) {
  //1) get the public profile associated with each handle
  //results to json object
  
  //Get promises for all Github avatars
  var allAvatars = githubHandles.map(function(handle) {
    return lib.getGitHubProfile(handle).
      then(function(profileObj){
        if(profileObj.message) {
          //throw new Error (profileObj.message);
        }
        return profileObj.avatarUrl;
      });
  });
  
  //Get promise for token for Clarifai
  var token = lib.authenticateImageTagger();
  
  //Once we have all Avatars and the token we can proceed
  return Promise.all(allAvatars.concat(token)).
    then(function(vals) {
      var token = vals.splice(vals.length-1)[0];
      var allTags = vals.map(function(avatar){
        return lib.tagImage(avatar, token);
      });
      
      return Promise.all(allTags, function(tags){
        return lib.getIntersection(tags)[0];
      }).catch(function(err){
        console.log(err);
      });  
    });
  //2) extract the avatar_url of each profile
  //4) get the set of tags for each avatar_url (requires authentication)
  //5) find the intersection of the tags
};

// Export these functions so we can unit test them
module.exports = {
  searchCommonTagsFromGitHubProfiles: searchCommonTagsFromGitHubProfiles
};
