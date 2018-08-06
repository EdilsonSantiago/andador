module.exports.cadastro = function(application, request, response){
  response.render("cadastro.ejs", {validacao: {}})
}

module.exports.cadastrar = function(application, request, response){
  var usuarioAndador = request.body

  request.assert('nome', 'O campo nome não pode estar vazio').notEmpty()
  request.assert('usuario', 'O campo usuario não pode estar vazio').notEmpty()
  request.assert('senha', 'A senha deve ter entre 6 e 14 caracteres').len(6,14)

  var erros = request.validationErrors()

  if(erros){
    response.render("cadastro.ejs", {validacao: erros})
    return
  }

  var connection = application.config.dbConnection()
  var usuarioModel = new application.app.models.UsuarioDao(connection)

  var crypto = require('crypto')
  var senha = crypto.createHash("md5").update(usuarioAndador.senha).digest("hex")
  var valores = [[usuarioAndador.nome, usuarioAndador.usuario, senha]]

  usuarioModel.cadastrar(valores, function(error, result){
      if(!error){
        usuarioModel.selecionarIdPeloNome(valores[0][1], function(errorId, resultId){
          if(!errorId){
            request.session.logado = true
            request.session.id_usuario = resultId[0].ID_USUARIO
            response.redirect('/home')
            }else{
	      console.log(errorId)
              response.redirect('/cadastro')
            }
        })
      }else{
        console.log(error)
        response.redirect('/cadastro')
      }
      
  })
}
