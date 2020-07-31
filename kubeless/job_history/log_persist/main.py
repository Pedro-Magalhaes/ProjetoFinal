
import json
import os
     

def hello_pubsub(event, context):
     
     if event:
          print(event)
          
          pubsub_message = json.dumps(event['data']) + '\n'
          print(pubsub_message)
          path = '/data/pv01/'
          print("Using folder: " + path)
          log_file_name = path + 'log.txt'

          # Mais simples que o google, MAS não eh safe pra acesso concorrente!!!
          with open(log_file_name,'a') as log_file:
               log_file.write(pubsub_message)

     else:
          print("Erro sem data no event")