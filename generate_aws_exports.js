const fs = require('fs');

const config = {
  API: {
    GraphQL: {
      endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT,
      region: process.env.REACT_APP_REGION,
      defaultAuthMode: 'apiKey',
      apiKey: process.env.REACT_APP_API_KEY,
    }
  }
};

const content = `const config = ${JSON.stringify(config)};\n\nexport default config;`;

fs.writeFileSync('src/aws-exports.js', content);
