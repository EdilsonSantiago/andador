module.exports.cadastrarPaciente = function(application, request, response){
  if(request.session.logado){
  	response.render("cadastrarPaciente", {validacao: {}})
  }else{
  	response.render('index', {validacao: {}})
  }
}

module.exports.cadastroDePaciente = function(application, request, response){
  var pacienteAndador = request.body

  request.assert('nome', 'O campo nome não pode estar vazio').notEmpty()
  request.assert('sexo', 'O campo sexo não pode estar vazio').notEmpty()
  request.assert('data', 'A data não pode estar vazia').notEmpty()

  var erros = request.validationErrors()

  if(erros){
    response.render("cadastrarPaciente.ejs", {validacao: erros})
    return
  }

  var connection = application.config.dbConnection()
  var pacienteModel = new application.app.models.PacienteDao(connection)

  var dadosPaciente = [pacienteAndador.nome, pacienteAndador.sexo, pacienteAndador.data, request.session.id_usuario]

  pacienteModel.cadastrar(dadosPaciente, function(error, result){
      if(!error){
        response.redirect('/home')
      }else{
        response.redirect('/cadastrar-paciente')
      }
  })
}

module.exports.paciente = function(application, request, response){
  if(request.session.logado){
    var id_paciente = request.query.id_paciente

    var connection = application.config.dbConnection()
    var pacienteModel = new application.app.models.PacienteDao(connection)
    var sessaoModel = new application.app.models.SessaoDao(connection)

    pacienteModel.selecionarPaciente(id_paciente, function(error, result){
      if(!error){
        sessaoModel.selecionarSessoes(id_paciente, function(error, resultSessoes){
          response.render("paciente", {paciente: result, id:id_paciente, sessoes: resultSessoes, erro: {}})
        })
      }else{
        response.redirect('/home')
      }
    })
  }else{
    response.render('index', {validacao: {}})
  }
}

module.exports.editarPaciente = function(application, request, response){
  if(request.session.logado){
      var connection = application.config.dbConnection()
      var pacienteModel = new application.app.models.PacienteDao(connection)

      request.session.id_paciente = request.query.id_paciente
      id_paciente = request.session.id_paciente

      pacienteModel.selecionarPaciente(id_paciente, function(error, result){
          if(!error){
            response.render('alterarDadosPaciente', {paciente: result})
          }else{
            response.redirect('/home')
          }
      })

  }else{
    response.render('index', {validacao: {}})
  }
}

module.exports.atualizaDadosPaciente = function(application, request, response){
  var pacienteAndador = request.body

  request.assert('nome', 'O campo nome não pode estar vazio').notEmpty()

  var erros = request.validationErrors()

  if(erros){
    response.render("alterarDados", {validacao: erros})
    return
  }

  var connection = application.config.dbConnection()
  var pacienteModel = new application.app.models.PacienteDao(connection)

  var id_paciente = request.session.id_paciente

  if(pacienteAndador.data == ""){
    var valores = [pacienteAndador.nome, pacienteAndador.sexo, id_paciente]
    pacienteModel.atualizarDadosPacienteSemData(valores, function(error, result){
      if(!error){
        response.redirect('/editar-paciente?id_paciente='+valores[2])
      }else{
        response.redirect('/home')
      }
  })
  }else{
    var valores = [pacienteAndador.nome, pacienteAndador.data, pacienteAndador.sexo, id_paciente]
    pacienteModel.atualizarDadosPacienteComData(valores, function(error, result){
      if(!error){
        response.redirect('/editar-paciente?id_paciente='+valores[3])
      }else{
        response.redirect('/home')
      }
  })
  }
}

module.exports.excluirPaciente = function(application, request, response){

  if(request.session.logado){
      var connection = application.config.dbConnection()
      var pacienteModel = new application.app.models.PacienteDao(connection)
      var sessaoModel = new application.app.models.SessaoDao(connection)

      var dados = request.body
      var idPaciente = dados.idPaciente

      pacienteModel.excluirPaciente(idPaciente, function(error, result){
          if(!error){
            sessaoModel.excluirSessoesDoPaciente(idPaciente, function(error, result){
                if(!error){
                  var string = encodeURIComponent('excluido');
                  response.redirect('/home?valid=' + string);
                }else{
                  response.redirect('/home');
                }
            })
          }
          else{
            response.redirect('/home')
          }
        })
    }else{
      response.render('index', {validacao: {}})
    }
}

module.exports.relatorioExcel = function(application, request, response){
  if(request.session.logado){
    var id_paciente = request.query.id_paciente

    var connection = application.config.dbConnection()
    var pacienteModel = new application.app.models.PacienteDao(connection)
    var sessaoModel = new application.app.models.SessaoDao(connection)

    pacienteModel.selecionarPaciente(id_paciente, function(error, result){
      if(!error){
        sessaoModel.selecionarSessoes(id_paciente, function(error, resultSessoes){
          //response.render("paciente", {paciente: result, id:id_paciente, sessoes: resultSessoes, erro: {}})
          var Excel = require('exceljs')
          var workbook = new Excel.Workbook()
          var worksheet = workbook.addWorksheet('Relatórios')

          worksheet.columns = [
            { header:'Data da Sessão', key:'DATA_SESSAO'},
            { header:'Distância Percorrida', key:'DISTANCIA_PERCORRIDA_SESSAO'},
            { header:'Duração da Sessão', key:'TEMPO_SESSAO'}
          ]

          worksheet.addRows(resultSessoes)
          response.setHeader('Content-disposition', 'attachment;filename=relatorio_paciente.xlsx')
          response.setHeader('Content-type', 'application/vnd.ms-excel');
          return workbook.xlsx.write(response).then(function(){response.end()})
        })
      }else{
        response.redirect('/home')
      }
    })
  }else{
    response.render('index', {validacao: {}})
  }
}
