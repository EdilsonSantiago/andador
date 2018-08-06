module.exports.alterarDados = function(application, request, response){
  if(request.session.logado){
      var connection = application.config.dbConnection()
      var usuarioModel = new application.app.models.UsuarioDao(connection)

      var id_usuario = request.session.id_usuario

      usuarioModel.selecionarUsuario(id_usuario, function(error, result){
          if(!error){
            response.render('alterarDados', {usuario: result})
          }else{
            response.redirect('/home')
          }      
      })

  }else{
  	response.render('index', {validacao: {}})
  }
}

module.exports.atualizar = function(application, request, response){
  var usuarioAndador = request.body

  request.assert('nome', 'O campo nome não pode estar vazio').notEmpty()

  var erros = request.validationErrors()

  if(erros){
    response.render("alterarDados", {validacao: erros})
    return
  }

  var connection = application.config.dbConnection()
  var usuarioModel = new application.app.models.UsuarioDao(connection)

  var id_usuario = request.session.id_usuario

  if(usuarioAndador.data == ""){
    var valores = [usuarioAndador.nome, usuarioAndador.profissao, usuarioAndador.sexo, id_usuario]
    usuarioModel.atualizarDadosSemData(valores, function(error, result){
      if(!error){
        response.redirect('/alterar-dados')
      }else{
        response.redirect('/home')
      }      
  })
  }else{
    var valores = [usuarioAndador.nome, usuarioAndador.profissao, usuarioAndador.sexo, usuarioAndador.data, id_usuario]
    usuarioModel.atualizarDadosComData(valores, function(error, result){
      if(!error){
        response.redirect('/alterar-dados')
      }else{
        response.redirect('/home')
      }      
  })
  }
}