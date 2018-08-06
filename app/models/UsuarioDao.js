function UsuarioDao(connection){
  this._connection = connection
}

UsuarioDao.prototype.cadastrar = function(usuario, callback){
  const query = 'INSERT INTO USUARIO(NOME_USUARIO, APELIDO_USUARIO, SENHA_USUARIO) VALUES ?'
  this._connection.query(query, [usuario], callback)
}

UsuarioDao.prototype.selecionarUsuario = function(id_usuario, callback){
  const query = 'SELECT NOME_USUARIO, SEXO_USUARIO, DATE_FORMAT(DATA_NASCIMENTO_USUARIO, "%d/%m/%Y") AS DATA_NASCIMENTO_USUARIO, APELIDO_USUARIO, PROFISSAO_USUARIO'+
                ' FROM USUARIO'+ 
                ' WHERE ID_USUARIO = ?'
  this._connection.query(query, id_usuario, callback)
}

UsuarioDao.prototype.selecionarIdPeloNome = function(nome_usuario, callback){
  const query = 'SELECT ID_USUARIO'+
                ' FROM USUARIO'+ 
                ' WHERE APELIDO_USUARIO = ?'
  this._connection.query(query, nome_usuario, callback)
}

UsuarioDao.prototype.autenticar = function(id_usuario, callback){
  const query = 'SELECT SENHA_USUARIO FROM USUARIO WHERE ID_USUARIO = ?'
  this._connection.query(query, id_usuario, callback)
}

UsuarioDao.prototype.atualizarDadosComData = function(valores, callback){
  const query = 'UPDATE USUARIO'+
                ' SET NOME_USUARIO = ?, PROFISSAO_USUARIO = ?, SEXO_USUARIO = ?, DATA_NASCIMENTO_USUARIO = STR_TO_DATE(?, "%d/%m/%Y")'+
                ' WHERE ID_USUARIO = ?'
  this._connection.query(query, valores, callback)
}

UsuarioDao.prototype.atualizarDadosSemData = function(valores, callback){
  const query = 'UPDATE USUARIO'+
                ' SET NOME_USUARIO = ?, PROFISSAO_USUARIO = ?, SEXO_USUARIO = ?'+
                ' WHERE ID_USUARIO = ?'
  this._connection.query(query, valores, callback)
}

module.exports = function(){
  return UsuarioDao
}