# Kong
## O que é
Kong é o gateway utilizado para fazer o service discovery dos microsserviços rodando no kubernetes do grupo Soma do tecgraf
## Como rodar
É necessario ter o docker e o docker-compose para subir o kong
* dentro da pasta docker basta subir o docker-compose utilizando o comando (pode ser necessário usar sudo):
	``` docker-compose up ```
* verificar se o serviço subiu 
podemos acessar o dashbord através do konga no endereço http://localhost:1337

Utilizei como base o compose do github do kong: [docker-compose.yml](https://github.com/Kong/docker-kong/blob/2.0.2/compose/docker-compose.yml)

## Plugins
### job_history_log
Esse plugin vai replicar a chamada feita ao microserviço Job-history para um ou mais endpoints
o plugin precisa ser instalado no kong, pelo docker compose basta fazer um bind da pasta do plugin com a pasta de plugins do container do kong e inserir na lista de plugins:
no compose basta colocar:
```yml
KONG_PLUGINS: bundled,external-auth
    networks:
      - kong-net 
    volumes:
      - ../kong/plugins/external-auth:/usr/local/share/lua/5.1/kong/plugins/external-auth
```
