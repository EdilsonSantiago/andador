module.exports.home = function(application, request, response){
  if(request.session.logado){
  	var connection = application.config.dbConnection()
  	var pacienteModel = new application.app.models.PacienteDao(connection)

  	pacienteModel.selecionarPacientes(request.session.id_usuario, function(error, result){
  	    if(!error){
  	    request.session.logado = true
        var valid = request.query.valid
  	    response.render('home', {pacientes: result, valid: valid})
  	    }else{
  	    response.redirect('/cadastrar-paciente')
  	    }

    })
  }else{
  	response.render('index', {validacao: {}})
  }
}

module.exports.sair = function(application, request, response){
  request.session.destroy(function(err){
  	response.render('index', {validacao: {}})
  })
}
