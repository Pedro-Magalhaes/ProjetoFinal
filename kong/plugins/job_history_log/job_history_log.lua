local http = require "resty.http"
local url = require("socket.url")

local _M = {}
local parsed_urls_cache = {}
--[[ 
   Olhar exemplo de uso do resty.http em:
      https://github.com/Kong/kong/blob/master/kong/plugins/http-log/handler.lua
]] 

-- Parse host url.
-- @param `url` host url
-- @return `parsed_url` a table with host details:
-- scheme, host, port, path, query, userinfo
local function parse_url(host_url)
   local parsed_url = parsed_urls_cache[host_url]
 
   if parsed_url then
     return parsed_url
   end
 
   parsed_url = url.parse(host_url)
   if not parsed_url.port then
     if parsed_url.scheme == "http" then
       parsed_url.port = 80
     elseif parsed_url.scheme == "https" then
       parsed_url.port = 443
     end
   end
   if not parsed_url.path then
     parsed_url.path = "/"
   end
 
   parsed_urls_cache[host_url] = parsed_url
 
   return parsed_url
 end


-- Sends the provided payload (a string) to the configured plugin host
-- @return true if everything was sent correctly, falsy if error
-- @return error message if there was an error
local function send_payload( conf, payload)
   local method = conf.method
   local timeout = conf.timeout
   local keepalive = conf.keepalive
   local content_type = conf.content_type
   local http_endpoint = conf.http_endpoint
 
   local ok, err
   local parsed_url = parse_url(http_endpoint)
   local host = parsed_url.host
   local port = tonumber(parsed_url.port)
 
   local httpc = http.new()
   httpc:set_timeout(timeout)
   ok, err = httpc:connect(host, port)
   if not ok then
     return nil, "failed to connect to " .. host .. ":" .. tostring(port) .. ": " .. err
   end
 
   if parsed_url.scheme == "https" then
     local _, err = httpc:ssl_handshake(true, host, false)
     if err then
       return nil, "failed to do SSL handshake with " ..
                   host .. ":" .. tostring(port) .. ": " .. err
     end
   end
  
   local res, err = httpc:request({
     method = method,
     path = parsed_url.path,
     query = parsed_url.query,
     headers = {
       ["Host"] = parsed_url.host,
       ["Content-Type"] = content_type,
       ["Content-Length"] = #payload
     },
     body = payload,
   })
   if not res then
     return nil, "failed request to " .. host .. ":" .. tostring(port) .. ": " .. err
   end
 
   -- always read response body, even if we discard it without using it on success
   local response_body = res:read_body()
   local success = res.status < 400
   local err_msg
 
   if not success then
     err_msg = "request to " .. host .. ":" .. tostring(port) ..
               " returned status code " .. tostring(res.status) .. " and body " ..
               response_body
   end
 
   ok, err = httpc:set_keepalive(keepalive)
   if not ok then
     -- the batch might already be processed at this point, so not being able to set the keepalive
     -- will not return false (the batch might not need to be reprocessed)
     kong.log.err("failed keepalive for ", host, ":", tostring(port), ": ", err)
   end
 
   return success, err_msg
 end

function _M.log_history(url, payload)

   local conf = {
      method = "POST", 
      timeout = 1000,
      keepalive = 0,
      content_type = "application/json",
      http_endpoint = url
   }
   
   local sent, error = send_payload(conf, payload)
   if not sent then
    print("******ERROR SENDING*********")
    print(error)
   end

   return true
end

return _M
