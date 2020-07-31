import base64
import json
import os
from google.cloud import storage
     

def hello_pubsub(event, context):
     
     if event:
          print(event)
          #pubsub_message = base64.b64decode(event).decode('utf-8')
          pubsub_message = json.dumps(event) + '\n'
          print(pubsub_message)
          bucket = os.environ.get('output_bucket')
          print("Using bucket: " + bucket)
          storage_client = storage.Client()
          bucket = storage_client.bucket(bucket)

          # Blob que vai  manter o log consolidado
          log_blob_name = os.environ.get('log_blob')
          log_blob = bucket.blob(log_blob_name)
          
          # Blob com a nova consulta
          new_blob = bucket.blob(event['id'])
          new_blob.upload_from_string(pubsub_message)

          # consolidando os blobs (nao eh posivel fazer append)
          log_blob.compose([log_blob,new_blob])

          # deletando o que foi adicionado ao log
          new_blob.delete()

     else:
          print("Erro sem data no event")