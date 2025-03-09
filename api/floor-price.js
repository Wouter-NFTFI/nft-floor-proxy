const axios = require('axios');

module.exports = async (req, res) => {
  // Full CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS request - critical for CORS to work!
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { slug } = req.query;
    const apiKey = '90414d13-22fa-4477-b1f9-55d4387a731b';
    
    if (!slug) {
      return res.status(400).json({ error: 'Missing slug parameter' });
    }

    // Current floor price endpoint
    const floorResponse = await axios.get(
      `https://api.nftpricefloor.com/api/projects/${slug}?qapikey=${apiKey}`
    );
    
    // Historical data endpoint
    const historicalResponse = await axios.get(
      `https://api.nftpricefloor.com/api/projects/${slug}/charts/1d?qapikey=${apiKey}`
    );
    
    // Return both floor price and historical data
    res.json({
      floorData: floorResponse.data,
      historicalData: historicalResponse.data
    });
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
};