# Google Cloud Functions

## site

<https://console.cloud.google.com>

## Formas de subir o código para a cloud

### gcloud

O google possui um binario (comando) para linux que permite enviarmos nossos arquivos/funções para a cloud

ex:

```console
gcloud functions deploy FUNCTION_NAME --runtime nodejs8 --trigger-http
```

### Post

Existe uma API da cloud que podemos usar para subir o código.

Exemplo:

```console
curl -X POST "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/FUNCTION_NAME" -H "Content-Type:application/json" --data '{"name":"Keyboard Cat"}'
```

### repositório

Podemos configurar um repositório para que commits gerem uploads automaticos de funções  ***ainda não explorei o funcionamento***

### mini IDE online

No website da cloud podemos escrever o código diretamente e fazer o upload, apenas utilizei este meio por enquanto

## Formas de trigger para funções

existem diversos, aqui vou apresentar apenas os quatro principais.
<https://cloud.google.com/functions/docs/calling/>

### Pubsub google

Serviço de mensageria que pode servir de triger para ativar funções, basta criarmos um tópico e cadastrar a função para ser ativada atráves de mensagens nele
<https://cloud.google.com/pubsub/docs/overview>

### Http

Forma mais comum de trigger, a cloud cria um url acessivel externamente que ao receber uma chamada ativa nossa função.

### Mudanças mo cloud storage

Podemos definir triggers baseados em mudanças(eventos) dentro de um "bucket". Os eventos suportados são:

* google.storage.object.finalize
* google.storage.object.delete
* google.storage.object.archive
* google.storage.object.metadataUpdate

## Documentação de desenvolvimento

<https://cloud.google.com/functions/docs/calling/pubsub>

sample de evento pub_sub de criação de artigo:
{"id":"1cb8d9d3-0a53-4fd3-8db7-e90033795e63","created":"2019-10-21T20:51:52.233Z","title":"meu titulo de novo","body":"body do artigo"}

Problemas:

Cors policy, como o frontend roda em ambiente local e o backend em outro servidor, o navegador por questões de segurança bloqueia a chamada
por cross-orign. Precisei tratar o cors, provavelmente o kubeless fora do minikube terá o mesmo problema em um ambiente menos toy onde o servidor e a aplicação não estão na mesma máquina.
