module.exports = function(application){
  application.get('/ajustarAltura', function(request, response){
    application.app.controllers.sessao.sessaoAjustarAltura(application, request, response)
  })
  application.post('/ajustarAltura', function(request, response){
    application.app.controllers.sessao.ajustarAltura(application, request, response)
  })
}
