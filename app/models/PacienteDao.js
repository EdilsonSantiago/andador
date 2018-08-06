function PacienteDao(connection){
  this._connection = connection
}

PacienteDao.prototype.cadastrar = function(paciente, callback){
  const query = 'INSERT INTO PACIENTE VALUES(NULL, ?, ?, STR_TO_DATE(?, "%d/%m/%Y"), ?)'
  this._connection.query(query, paciente, callback)
}

PacienteDao.prototype.selecionarPacientes = function(id_usuario, callback){
  const query = 'SELECT P.ID_PACIENTE, P.NOME_PACIENTE, P.SEXO_PACIENTE, DATE_FORMAT(P.DATA_DE_NASCIMENTO_PACIENTE, "%d/%m/%Y") AS DATA_DE_NASCIMENTO_PACIENTE'+
				        ' FROM USUARIO U'+
				        ' INNER JOIN PACIENTE P'+
				        ' ON U.ID_USUARIO = P.IDUSUARIO'+
				        ' WHERE U.ID_USUARIO = ?'
  this._connection.query(query, id_usuario, callback)
}

PacienteDao.prototype.selecionarPaciente = function(id_paciente, callback){
  const query = 'SELECT NOME_PACIENTE, SEXO_PACIENTE, DATE_FORMAT(DATA_DE_NASCIMENTO_PACIENTE, "%d/%m/%Y") AS DATA_NASCIMENTO_PACIENTE'+
				        ' FROM PACIENTE'+
				        ' WHERE ID_PACIENTE = ?'
  this._connection.query(query, id_paciente, callback)
}

PacienteDao.prototype.atualizarDadosPacienteComData = function(valores, callback){
  const query = 'UPDATE PACIENTE'+
                ' SET NOME_PACIENTE = ?, DATA_DE_NASCIMENTO_PACIENTE = STR_TO_DATE(?, "%d/%m/%Y"), SEXO_PACIENTE = ?'+
                ' WHERE ID_PACIENTE = ?'
  this._connection.query(query, valores, callback)
}

PacienteDao.prototype.atualizarDadosPacienteSemData = function(valores, callback){
  const query = 'UPDATE PACIENTE'+
                ' SET NOME_PACIENTE = ?, SEXO_PACIENTE = ?'+
                ' WHERE ID_PACIENTE = ?'
  this._connection.query(query, valores, callback)
}

PacienteDao.prototype.excluirPaciente = function(id_paciente, callback){
  const query = 'DELETE'+
                ' FROM PACIENTE'+
                ' WHERE ID_PACIENTE = ?'
  this._connection.query(query, id_paciente, callback)
}

module.exports = function(){
  return PacienteDao
}
