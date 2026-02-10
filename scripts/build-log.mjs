import pkg from '../package.json' assert { type: 'json' };

const info = {
  timestamp: new Date().toISOString(),
  node: process.version,
  app: `${pkg.name}@${pkg.version}`,
  next: pkg.dependencies?.next,
  react: pkg.dependencies?.react,
  reactDom: pkg.dependencies?.['react-dom'],
  context: process.env.CONTEXT || process.env.NETLIFY || 'local',
  buildId: process.env.BUILD_ID || process.env.NETLIFY_BUILD_ID || null,
  deployId: process.env.DEPLOY_ID || process.env.NETLIFY_DEPLOY_ID || null,
  reviewId: process.env.REVIEW_ID || null,
};

console.log('[build] start', info);
