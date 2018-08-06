module.exports = function(application){
  application.get('/cadastrar-paciente', function(request, response){
    application.app.controllers.paciente.cadastrarPaciente(application, request, response)
  })
  application.post('/cadastro-paciente', function(request, response){
    application.app.controllers.paciente.cadastroDePaciente(application, request, response)
  })
  application.get('/paciente', function(request, response){
    application.app.controllers.paciente.paciente(application, request, response)
  })
  application.get('/editar-paciente', function(request, response){
    application.app.controllers.paciente.editarPaciente(application, request, response)
  })
  application.post('/editar-paciente', function(request, response){
    application.app.controllers.paciente.atualizaDadosPaciente(application, request, response)
  })
  application.post('/excluir-paciente', function(request, response){
    application.app.controllers.paciente.excluirPaciente(application, request, response)
  })
  application.get('/download-excel', function(request, response){
    application.app.controllers.paciente.relatorioExcel(application, request, response)
  })
}
