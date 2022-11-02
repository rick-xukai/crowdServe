process.chdir(__dirname);
const next = require('next');
const http = require('http');
const { parse } = require('url');
const path = require('path');

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

const app = next({
  hostname: listenHost,
  port: listenPort,
  dir: path.join(__dirname),
  dev: process.env.NODE_ENV != 'production',
  customServer: true,
  conf: serverConf
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(listenPort, (err) => {
    if (err) {
      console.error("Failed to start server", err);
      process.exit(1);
    }
    console.log(`Listening on ${listenHost}:${listenPort}`);
  });
});
