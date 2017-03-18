# HOWTO SOLUTION

First of all to run a project without errors like `*"Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https, chrome-extension-resource."*` you may choose one of the following: 

  - run any local server on your machine (**WAMP**, **XAMP** or you can use any servers for Node, Ruby etc). For Example : `npm install -g http-server` for NODE or `python -m SimpleHTTPServer` for PYTHON 
  - disable security in Chrome by using this flag **--allow-file-access-from-files**
  - run project in Firefox (Firefox currently allows Cross Origin Requests from files served from your hard drive)
  - open and run this project in any IDE (**Webstorm, PHPStorm, Eclipse** etc) with integrated http server.

#Thanks!
