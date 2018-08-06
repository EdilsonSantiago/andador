module.exports = function(application){
  application.get('/sessao', function(request, response){
    application.app.controllers.sessao.sessao(application, request, response)
  })
  application.get('/encerrarSessao', function(request, response){
    application.app.controllers.sessao.encerrarSessao(application, request, response)
  })
  application.post('/sessao', function(request, response){
    application.app.controllers.sessao.andador(application, request, response)
  })
  application.post('/iniciarSessao', function(request, response){
    application.app.controllers.sessao.iniciarSessao(application, request, response)
  })
}
