const http = require('http'),
      fs   = require('fs'),
      port = 3000

const server = http.createServer( function( request,response ) {
  switch( request.url ) {
    case '/':
      sendFile( response, 'public/login.html' )
      break
    case '/index.html':
      sendFile( response, 'public/login.html' )
      break
    case '/signup.html':
      sendFile( response, 'public/signup.html' )
      break
    case '/style.css':
      sendFile( response, 'public/style.css' )
      break
      case '/createAccount': //will change this when database is avaliable
        sendFile( response, 'public/signup.html' )
        break
        case '/login'://will change this when database is avaliable
            sendFile( response, 'public/index.html' )
            break
    default:
      response.end( '404 Error: File Not Found' )
  }
})

server.listen( process.env.PORT || port )

const sendFile = function( response, filename ) {
   fs.readFile( filename, function( err, content ) {
     response.end( content, 'utf-8' )
   })
}



}