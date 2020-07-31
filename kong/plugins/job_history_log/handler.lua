local BasePlugin = require "kong.plugins.base_plugin"
local http = require "resty.http"
local job_history_log = require "kong.plugins.job_history_log.job_history_log"
local kong = kong
local jobHistoryLogHandler = BasePlugin:extend()


function jobHistoryLogHandler:new()
  jobHistoryLogHandler.super.new(self, "job_history_log")
end

-- Verificar se posso jogar diretamente (google e kubelles) Pode ser caro fazer a primeira chamada
-- variáveis de configuração
-- conf.path (string)
-- conf.urls (array de urls)
function jobHistoryLogHandler:access(conf)  -- TODO: Alterar para acessar na faze de log!!
  jobHistoryLogHandler.super.access(self) -- https://docs.konghq.com/0.14.x/plugin-development/custom-logic/
  
  local path = kong.request.get_path();

  -- -- somente uma checagem extra se o end point é o job_history
  -- if string.find(path, "history") == nil then 
  --   print("path errado?")
  --   return
  -- end

  local request_method = kong.request.get_method()
  local url_queries = kong.request.get_query()
  local used_query = ""
  if url_queries ~= nil then
    used_query = url_queries.q
  end

  
  local payload = '{"query": "' .. used_query .. '"}' -- string formato json

  if conf.urls ~= nil then
    for k,url in ipairs(conf.urls) do
      job_history_log.log_history(url,payload)
    end
  end
end

jobHistoryLogHandler.PRIORITY = 900

return jobHistoryLogHandler
