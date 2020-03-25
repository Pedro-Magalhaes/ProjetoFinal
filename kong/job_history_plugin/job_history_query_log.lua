local http_request = require "http.request"
local http_util = require "http.util"
--local dkjson = require "dkjson"

local _M = {}


function _M.verify_token_csgrid(url, path, user_token, validation_type, locale)
   local r = http_request.new_from_uri(string.format("%s%s",url ,path))

   --Monta o method da request e o header
   r.headers:upsert(":method", "POST")
   r.headers:upsert("content-type", "application/x-www-form-urlencoded")

   --Monta o body como string e o atribui a request
   local body = http_util.dict_to_query({
	["validationType"] = validation_type;
	["userToken"] = user_token;
	["locale"] = locale;
   })	
   r:set_body(body)

   --Executa a request
   local headers, stream, errno = r:go()

   --Obtém o código do retorno
   local http_status = headers:get(":status")
   
   --Checa se o retorno do csgrid contem um codigo 2xx
   if http_status: sub(1,1) == "2" then      
      local r_body, err, errno2 = stream:get_body_as_string()
      if not r_body then
         return false
      end
      stream:shutdown()
      --Como o kong estava dando erro para importar o dkjson, fiz de uma forma mais simples
      return string.match(r_body, "true");

   else
      return false
   end
end

return _M
