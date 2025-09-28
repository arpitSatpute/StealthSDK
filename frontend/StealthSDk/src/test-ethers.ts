// Test file to verify ethers.js setup
import { ethers } from 'ethers';

export const testEthersSetup = () => {
  try {
    console.log('Testing ethers.js setup...');
    
    // Test provider creation
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-amoy.polygon.technology/');
    console.log('✅ Provider created successfully:', provider);
    
    // Test basic provider methods
    provider.getNetwork().then(network => {
      console.log('✅ Network info:', network);
    }).catch(error => {
      console.error('❌ Network error:', error);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Ethers setup failed:', error);
    return false;
  }
};

// Test on module load
if (typeof window !== 'undefined') {
  testEthersSetup();
}