process.chdir(__dirname);
const NextServer = require('next/dist/server/next-server').default;
const http = require('http');
const path = require('path');

// Make sure commands gracefully respect termination signals (e.g. from Docker)
// Allow the graceful termination to be manually configurable
if (!process.env.NEXT_MANUAL_SIG_HANDLE) {
  process.on('SIGTERM', () => process.exit(0));
  process.on('SIGINT', () => process.exit(0));
}

let handler;

const server = http.createServer(async (req, res) => {
  try {
    if (handler) {
      await handler(req, res);
    } else {
      res.statusCode = 404;
      res.end('page not found');
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('internal server error');
  }
});

const listenHost = process.env.HOST || '0.0.0.0';
const listenPort = parseInt(process.env.PORT, 10) || 8080;

const serverConf = {
  "env": {},
  "webpack": null,
  "webpackDevMiddleware": null,
  "eslint": {
    "ignoreDuringBuilds": false
  },
  "typescript": {
    "ignoreBuildErrors": false,
    "tsconfigPath": "tsconfig.json"
  },
  "distDir": "./.next",
  "cleanDistDir": true,
  "assetPrefix": "",
  "configOrigin": "next.config.js",
  "useFileSystemPublicRoutes": true,
  "generateEtags": true,
  "pageExtensions": ["tsx", "ts", "jsx", "js"],
  "target": "server",
  "poweredByHeader": true,
  "compress": true,
  "analyticsId": "",
  "images": {
    "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384],
    "path": "/_next/image",
    "loader": "default",
    "domains": [],
    "disableStaticImages": false,
    "minimumCacheTTL": 60,
    "formats": ["image/webp"],
    "dangerouslyAllowSVG": false,
    "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;",
    "remotePatterns": [],
    "unoptimized": false
  },
  "devIndicators": {
    "buildActivity": true,
    "buildActivityPosition": "bottom-right"
  },
  "onDemandEntries": {
    "maxInactiveAge": 15000,
    "pagesBufferLength": 2
  },
  "amp": {
    "canonicalBase": ""
  },
  "basePath": "",
  "sassOptions": {},
  "trailingSlash": false,
  "i18n": null,
  "productionBrowserSourceMaps": false,
  "optimizeFonts": true,
  "excludeDefaultMomentLocales": true,
  "serverRuntimeConfig": {},
  "publicRuntimeConfig": {},
  "reactStrictMode": false,
  "httpAgentOptions": {
    "keepAlive": true
  },
  "outputFileTracing": true,
  "staticPageGenerationTimeout": 60,
  "swcMinify": true,
  "output": "standalone",
  "experimental": {
    "optimisticClientCache": true,
    "manualClientBasePath": false,
    "legacyBrowsers": true,
    "browsersListForSwc": false,
    "newNextLinkBehavior": false,
    "cpus": 11,
    "sharedPool": true,
    "profiling": false,
    "isrFlushToDisk": true,
    "workerThreads": false,
    "pageEnv": false,
    "optimizeCss": false,
    "nextScriptWorkers": false,
    "scrollRestoration": false,
    "externalDir": false,
    "disableOptimizedLoading": false,
    "gzipSize": true,
    "swcFileReading": true,
    "craCompat": false,
    "esmExternals": true,
    "appDir": false,
    "isrMemoryCacheSize": 52428800,
    "serverComponents": false,
    "fullySpecified": false,
    "outputFileTracingRoot": "",
    "swcTraceProfiling": false,
    "forceSwcTransforms": false,
    "largePageDataBytes": 128000,
    "adjustFontFallbacks": false,
    "trustHostHeader": false
  },
  "configFileName": "next.config.js",
  "compiler": {
    "styledComponents": true
  }
};

server.listen(listenPort, (err) => {
  if (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }

  const nextServer = new NextServer({
    hostname: listenHost,
    port: listenPort,
    dir: path.join(__dirname),
    dev: process.env.NODE_ENV != 'production',
    customServer: true,
    conf: serverConf
  });
  handler = nextServer.getRequestHandler();
  console.log(`Listening on ${listenHost}:${listenPort}`);
});
