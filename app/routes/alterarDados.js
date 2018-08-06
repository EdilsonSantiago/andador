module.exports = function(application){
  application.get('/alterar-dados', function(request, response){
    application.app.controllers.alterarDados.alterarDados(application, request, response)
  })
  application.post('/alterar-dados', function(request, response){
    application.app.controllers.alterarDados.atualizar(application, request, response)
  })
}