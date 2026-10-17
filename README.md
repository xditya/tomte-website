# tomte-website

The website for [Tomte](https://github.com/xditya/tomte-windows), served at https://tomte.xditya.me.

The pages are plain HTML, CSS and JavaScript in `public/`. Open `public/index.html` in a browser to preview them.

Deploy with `npx wrangler deploy`. It publishes `public/` as a Cloudflare Worker and attaches the custom domain set in
`wrangler.jsonc`, which needs xditya.me to be a zone in the same Cloudflare account.
