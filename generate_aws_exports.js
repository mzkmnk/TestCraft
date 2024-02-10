const fs = require('fs');

const config = {
  API: {
    GraphQL: {
      endpoint: process.env.ENDPOINT,
      region: process.env.REGION,
      defaultAuthMode: 'apiKey',
      apiKey: process.env.APIKEY,
    }
  }
};

const content = `const config = ${JSON.stringify(config)};\n\nexport default config;`;

fs.writeFileSync('frontend/app/src/aws-exports.js', content);
