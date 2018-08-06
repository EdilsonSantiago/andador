module.exports.index = function(application, request, response){
  response.render('index', {validacao: {}})
}

module.exports.autenticar = function(application, request, response){
  var dados = request.body
  request.assert('apelido', '• O campo usuario não pode estar vazio.').notEmpty()
  request.assert('senha','• O campo senha não pode estar vazio.').notEmpty()

  var erros = request.validationErrors()

  if(erros){
  	response.render('index', {validacao: erros})
  	return
  }

  var connection = application.config.dbConnection()
  var usuarioModel = new application.app.models.UsuarioDao(connection)


  usuarioModel.selecionarIdPeloNome(dados.apelido, function(errorId, resultId){
    if(resultId[0]){
      usuarioModel.autenticar(resultId[0].ID_USUARIO, function(error, result){
        var crypto = require('crypto')
        var senha = crypto.createHash("md5").update(dados.senha).digest("hex")
        if(result[0].SENHA_USUARIO == senha){
          request.session.logado = true
          request.session.id_usuario = resultId[0].ID_USUARIO
          response.redirect('/home')
          return
        }else{
          response.render('index', {validacao: [{msg: "• Senha incorreta."}]})
          return
        }
      })
    }else{
      response.render('index', {validacao: [{msg: "• Usuário invalido."}]})
    }
  })
}
