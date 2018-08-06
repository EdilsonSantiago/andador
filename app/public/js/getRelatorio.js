$('#link-download').on('click', function(){
  $.ajax({
    type: "GET",
    url: "/download-excel?id_paciente="+$('#idPaciente').val(),
    xhrFields: { responseType: "blob" },
    data: {},
    success: function(data){
      let blob = new Blob([data], {type: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
      console.log(blob)
      saveAs(blob, 'relatorio_paciente.xlsx');
     }
  })
})
