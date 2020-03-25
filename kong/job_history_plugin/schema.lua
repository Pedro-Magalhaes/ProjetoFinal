return {
  no_consumer = true,
  fields = { 
    path = {'/jobs/history'}, -- caminho do recurso que queremos escutar
    urls = { type = "array"} -- urls para enviar a chamada recebida
  }
}