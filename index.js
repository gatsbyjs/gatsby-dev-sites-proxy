const http = require("http")
const httpProxy = require("http-proxy")
const proxy = httpProxy.createProxyServer({})

http
  .createServer(function(req, res) {
    // Add index.html to bare requests as for some reason bucket.s3-website won't work.
    if (req.url.slice(-1) === `/`) {
      req.url = `${req.url}index.html`
    }
    console.log(req.headers.host, req.url)
    const target = `http://s3.amazonaws.com/gatsby-js-builds/examples/${
      req.headers.host
    }`

    console.log(target)

    proxy.web(req, res, {
      prependPath: true,
      target,
    })
  })
  .listen(process.env.PORT || 3000)
// "http://gatsby-js-builds.s3-website-us-east-1.amazonaws.com/examples/using-remark---1124a063ec2b2d32d826ce451d01db865cf02a12.gatsbydev.com",
