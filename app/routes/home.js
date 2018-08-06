module.exports = function(application){
  application.get('/home', function(request, response){
    application.app.controllers.home.home(application, request, response)
  })
  application.get('/sair', function(request, response){
    application.app.controllers.home.sair(application, request, response)
  })
}