const { exec } = require('child_process');
const path = require('path');

// List of functions to deploy in order
const functions = [
  'getUserProfile',
  'createUserProfile', 
  'updateUserProfile',
  'getUserById',
  'toggleFollow',
  'getUserFollowers',
  'getUserFollowing',
  'retrieveTokens'
];

let currentIndex = 0;

function deployNext() {
  if (currentIndex >= functions.length) {
    console.log('✅ All functions deployed successfully!');
    return;
  }

  const functionName = functions[currentIndex];
  console.log(`🚀 Deploying ${functionName}... (${currentIndex + 1}/${functions.length})`);
  
  exec(`firebase deploy --only functions:${functionName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error deploying ${functionName}:`, error);
      console.log('Retrying in 5 seconds...');
      setTimeout(() => deployNext(), 5000);
      return;
    }
    
    console.log(`✅ ${functionName} deployed successfully!`);
    currentIndex++;
    
    // Wait 2 seconds between deployments
    setTimeout(() => deployNext(), 2000);
  });
}

console.log('🎯 Starting individual function deployment...');
deployNext();
