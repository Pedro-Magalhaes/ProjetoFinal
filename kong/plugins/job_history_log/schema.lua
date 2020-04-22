
local typedefs = require "kong.db.schema.typedefs"


return {
  name = "job_history_log",
  fields = {
    {
      -- this plugin will only be applied to Services or Routes
      consumer = typedefs.no_consumer
    },
    {
      -- this plugin will only run within Nginx HTTP module
      protocols = typedefs.protocols_http
    },
    {
      config = {
        type = "record",
        fields = {
          {
            path = { type = "string", default = "/jobs/history"}
          },
          {
            urls = { 
            type = "array",
            elements = {
              type = "string",
              default = 
                "https://us-central1-kubernetes-tecgraf.cloudfunctions.net/log_history_query",
              
              }
            }
          }
        },
      },
    },
  },
  entity_checks = {
    -- Describe your plugin's entity validation rules
  },
}