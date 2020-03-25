local BasePlugin = require "kong.plugins.base_plugin"
local http = require "resty.http"
local job_history_query_log = require "kong.plugins.external-auth.job_history_plugin"

local kong = kong
local ExternalAuthHandler = BasePlugin:extend()

-- variáveis de configuração
-- conf.path (string)
-- conf.urls (array de urls)

local function check_path_in_blacklist(blacklist,path)
  local correct_path = path:gsub("/$","")
  for i=1,#blacklist do
    if correct_path:find(blacklist[i]) then
      return true
    end
  end
  return false
end

local function has_value(tab, val)
  for value in tab do
    -- Remove possiveis espaço em branco caso haja
    local value = value:match "^%s*(.-)%s*$"
    if value:lower() == val then
      return true
    end 
  end  
  return false
end

local function get_authorization_code()
  local auth_code =  nil
  --Caso ja tenha um campo authorazation, utiliza ele 
  local expected_auth_code = kong.request.get_header("Authorization")
  if expected_auth_code ~= nil then  
    auth_code =  expected_auth_code
  else
    --Caso não tenha, checa se é WS para buscar o token na query
    local connection_header = kong.request.get_header("Connection") or ""
    local upgrade_header = kong.request.get_header("Upgrade") or ""
    if has_value(connection_header:gmatch("([^,]+)"), "upgrade") and has_value(upgrade_header:gmatch("([^,]+)"), "websocket") then
      auth_code = "Bearer "..kong.request.get_raw_query()
    end

  end

  return auth_code

end

function ExternalAuthHandler:new()
  ExternalAuthHandler.super.new(self, "external-auth")
end

function ExternalAuthHandler:access(conf)
  ExternalAuthHandler.super.access(self)

  local path = kong.request.get_path();
  local request_method= kong.request.get_method()
  
  --Caso esteja na blacklist e não seja options, checa se há token
  if request_method ~= "OPTIONS" and check_path_in_blacklist(conf.blacklist,path) then
  
    --Checa se há um token na chamada     
    local auth_code = get_authorization_code() 
    if auth_code == nil then  
      return kong.response.exit(401, {message="Token não encontrado"})
    end

    --Chama o csgrid passando o token
    local token_without_bearer = string.match(auth_code, "Bearer (.+)")
    if token_without_bearer == nil then
      return kong.response.exit(401, {message="Token invalido"})
    end
    local is_valid_token = job_history_query_log.verify_token_csgrid(conf.authUrl, "v1/authentication/token/validation", token_without_bearer, "access", "pt-br")
  
    --Caso nao seja valido, retorna 401
    if not is_valid_token then
      return kong.response.exit(401, {message="Token encontrado, porém não é válido"})
    end
  end
  

end

ExternalAuthHandler.PRIORITY = 900

return ExternalAuthHandler
