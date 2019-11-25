# Passo a passo para criação do forum

## Criar tópicos para a comunicação
Criar um tópico para criação de artigos

## Criação das funções

### Criação de artigos
Criar uma google function com trigger html para recebe a chamada com o título e body de um artigo
cria o objeto artigo e coloca no tópico

Criar uma função com trigger de mensagem no tópico de criaço de arquivos que vai depoisitar no banco o artigo


### Fazendo o pusher

Temos que criar uma conta no pusher.com para comunicar os eventos ocorridos no pub-sub do google com o front-end.
O front end tem que conectar com a mesma key do pusher usada no back-end, usar o mesmo "tópico" para receber.