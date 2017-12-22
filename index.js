const http = require(`http`)
const connect = require("connect")
const httpProxy = require("./http-proxy")
const proxy = httpProxy.createProxyServer()
const compression = require(`compression`)

const app = connect()
app.use(compression())
app.use(function(req, res) {
  // Add index.html to bare requests as for some reason bucket.s3-website won't work.
  if (req.url.slice(-1) === `/`) {
    req.url = `${req.url}index.html`
  }
  console.log(req.headers.host, req.url)
  const target = `http://s3.amazonaws.com/gatsby-js-builds/examples/${
    req.headers.host
  }`

  console.log(`target`, target)

  proxy.web(req, res, {
    prependPath: true,
    changeOrigin: true,
    target,
  })
})
http.createServer(app).listen(process.env.PORT || 3000)

// "http://gatsby-js-builds.s3-website-us-east-1.amazonaws.com/examples/using-remark---1124a063ec2b2d32d826ce451d01db865cf02a12.gatsbydev.com",
