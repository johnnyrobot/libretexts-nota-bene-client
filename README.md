# NB document annotator plugin

## LibreTexts native baseline

This development fork preserves the NB client from `haystack/nbclient` commit `24f988ed17f3d26ea13c15b26b80ca80d01e4ed6`. Pair it with the `johnnyrobot/libretexts-nota-bene` server checkout and its `docs/NATIVE-BASELINE.md` procedure. Record both fork commits for a reproducible pair.

With Node 22.23.4 and npm 10.9.9, run `npm ci --ignore-scripts --no-audit --no-fund`, then `npm run build`. No global webpack installation is needed. The existing development configuration targets local HTTPS ports 3000 (API) and 3001 (plugin assets). The paired server's baseline launcher serves this bundle using fresh task-only TLS material; do not run the legacy server with its tracked development keys.

The original application code is unchanged. Build output retains existing lint and bundle-size warnings. The original test script is a failing placeholder. Authenticated annotation/reply and restart verification live in the paired server's baseline harness. That harness blocks inherited external asset URLs; it does not establish complete math/media rendering or production readiness. Preserve upstream attribution and license provenance.

The upstream setup notes follow for historical context.

## Prerequisites
- Have `node` and `npm` installed: https://www.npmjs.com/get-npm
- Have `webpack` installed: Run `npm install -g webpack` after `npm` is installed

## Installation
```
git clone https://github.com/alisaono/nbdemo.git
cd nbdemo
npm install
npm install -g webpack
```

## Usage
- All JS/Vue source code is under `src/` (things you'd be making change to most of the time)
- Exception is the CSS files which are under `public/style`
- To compile the JS/Vue source code:
```
cd nbdemo
webpack
```
- You'll find the compiled code (`bundle.js`) under `public/js`

## Optional (Recommended)

### Hosting files locally
You can host the plugin files locally, which is useful for embedding and testing them locally. To do so:
```
cd nbdemo
npm run start
```
You will then find the files hosted at `localhost:3001` (e.g. `localhost:3001/js/bundle.js`)

Note: Since we're using a self generated certificate for development, the browser will alert that you are running an insecure server. Got to this URL `localhost:3001/js/bundle.js` in Chrome then type: thisisunsafe. (note: there is no text box to type this in, you have to type it on yout keyboard to get through). You can also press the advanced button then press continue to site.

### Code documentation
To see a nice webpage version of the in-file code documentation as, do:
```
cd nbdemo
./node_modules/.bin/jsdoc -r src/ -c jsdoc.json
```
You will then find `out/index.html` which you can view in your browser.


Currently the in-file code documentation follows the `jsdoc` (https://github.com/jsdoc/jsdoc) format and it's highly recommended to continue following this documentation format or another standard format if you choose something else.
