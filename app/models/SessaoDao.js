function SessaoDao(connection){
  this._connection = connection
}

SessaoDao.prototype.selecionarSessoes = function(id_paciente, callback){
  const query = 'SELECT S.ID_SESSAO, S.TEMPO_SESSAO, S.DISTANCIA_PERCORRIDA_SESSAO, DATE_FORMAT(S.DATA_SESSAO, "%d/%m/%Y") AS DATA_SESSAO'+
				' FROM PACIENTE P'+
				' INNER JOIN SESSAO S'+
				' ON P.ID_PACIENTE = S.IDPACIENTE'+
				' WHERE P.ID_PACIENTE = ?'+
				' ORDER BY S.DATA_SESSAO DESC'
  this._connection.query(query, id_paciente, callback)
}

SessaoDao.prototype.inserirSessao = function(valores, callback){
  const query = 'INSERT INTO SESSAO VALUES(NULL, ?, ?, STR_TO_DATE(?, "%d/%m/%Y"), ?)'
  this._connection.query(query, valores, callback)
}

SessaoDao.prototype.excluirSessoesDoPaciente = function(id_paciente, callback){
  const query = 'DELETE'+
                ' FROM SESSAO'+
                ' WHERE IDPACIENTE = ?'
  this._connection.query(query, id_paciente, callback)
}

module.exports = function(){
  return SessaoDao
}
