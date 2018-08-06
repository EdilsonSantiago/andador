module.exports.sessao = function(application, request, response){
  if(request.session.logado){
    response.render("sessao")
  }else{
    response.render('index', {validacao: {}})
  }
}

module.exports.iniciarSessao = function(application, request, response){
  var dados = request.body
  request.session.distancia = 0
  request.session.movimentos = []
  request.session.data = dados.data
  var data = new Date()
  request.session.tempoInicial = data.getTime()
  response.redirect("sessao?id_paciente="+dados.idPaciente)

}

module.exports.andador = function(application, request, response){
  var dadosRecebidos = request.body


  var Gpio = require('pigpio').Gpio,
    motorCompleto = new Gpio(4, {mode: Gpio.OUTPUT}),
    motorMetade = new Gpio(14, {mode: Gpio.OUTPUT}),
    pulseWidth = 2000,
    pulseWidthA = 1000,
    increment = 100

  request.session.movimentos.push(dadosRecebidos.direcao)
  //console.log(request.session.movimentos)
  if(dadosRecebidos.direcao == "frente")
  {
    request.session.distancia += 1
    motorCompleto.servoWrite(pulseWidth)
  }
  else if(dadosRecebidos.direcao == "atras")
  {
    request.session.distancia += 1
    motorCompleto.servoWrite(pulseWidthA)
  }
  else if(dadosRecebidos.direcao == "direita")
  {
    motorMetade.servoWrite(pulseWidth)
  }
  else if(dadosRecebidos.direcao == "esquerda")
  {
    motorMetade.servoWrite(pulseWidthA)
  }
  else
  {
    motorCompleto.servoWrite(0)
  }

  //console.log(request.session.distancia)
  //console.log(dadosRecebidos.direcao)

  response.render("sessao")
}

module.exports.encerrarSessao = function(application, request, response){
  var data = new Date()
  var tempoTotal = data.getTime() - request.session.tempoInicial

  var segundos = parseInt((tempoTotal/1000)%60)
      ,minutos = parseInt((tempoTotal/(1000*60))%60)
      ,horas = parseInt((tempoTotal/(1000*60*60))%24)

  horas = (horas < 10) ? "0" + horas : horas
  minutos = (minutos < 10) ? "0" + minutos : minutos
  segundos = (segundos < 10) ? "0" + segundos : segundos

  var dataSessao = 0

  tempoSessao = horas + ":" + minutos + ":" + segundos
  request.session.data != '' ? dataSessao = request.session.data : dataSessao = '01/01/2000'
  var dadosSessao = [tempoSessao, request.session.distancia, dataSessao, request.session.id_paciente]
  console.log(dadosSessao)

  //Vetores direcao ----------------------------------------------------------
  var angulo = 0
  var xat = 0
  var yat = 0
  var x = [0]
  var y = [0]
  var movimentos = request.session.movimentos
  var tamMovimentos = movimentos.length

  for (var i = 0; i < tamMovimentos; i++) {
    if (movimentos[i] == 'frente') {
      xat = (Math.cos(angulo)*0.1) + xat
      yat = (Math.sin(angulo)*0.1) + yat
      x.push(xat)
      y.push(yat)
    }else if (movimentos[i] == 'tras') {
      xat += (Math.cos(angulo)*(-0.1))
      yat += (Math.sin(angulo)*(-0.1))
      x.push(xat)
      y.push(yat)
    }else if (movimentos[i] == 'direita') {
      angulo -= Math.PI/4
    }else if (movimentos[i] == 'esquerda'){
      angulo += Math.PI/4
    }
  }

  console.log(x)
  console.log(y)
  //Vetores direcao ----------------------------------------------------------


  if(request.session.logado){
  	var connection = application.config.dbConnection()
  }

  var sessaoModel = new application.app.models.SessaoDao(connection)

  sessaoModel.inserirSessao(dadosSessao, function(error, result){
      if(!error){
        response.redirect('/paciente?id_paciente='+request.session.id_paciente)
      }else{
        response.redirect('/home')
      }
  })

}

module.exports.sessaoAjustarAltura = function(application, request, response){
  if(request.session.logado){
    request.session.id_paciente = request.query.id_paciente
    id_paciente = request.session.id_paciente
    response.render("sessaoAjustarAltura", {id_paciente: id_paciente})
  }else {
    response.redirect("index")
  }
}

module.exports.ajustarAltura = function(application, request, response){
  var dadosRecebidos = request.body

  var Gpio = require('pigpio').Gpio,
    motorAltura = new Gpio(15, {mode: Gpio.OUTPUT}),
    pulseWidth = 2000,
    pulseWidthA = 1000,
    increment = 100

  if(dadosRecebidos.direcao == "cima")
  {
    motorAltura.servoWrite(pulseWidth)
  }
  else if(dadosRecebidos.direcao == "baixo")
  {
    motorAltura.servoWrite(pulseWidthA)
  }
  else
  {
    motorAltura.servoWrite(0)
  }

  //console.log(dadosRecebidos.direcao)
  response.render("sessaoAjustarAltura")
}
