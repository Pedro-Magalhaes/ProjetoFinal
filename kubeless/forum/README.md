# Forum

## Geral

* instalar minikube. versão: minikube v1.3.1 on Ubuntu 16.04

    ```console
       $ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
    && sudo install minikube-linux-amd64 /usr/local/bin/minikube  
    ```

* Instalar kubeless: https://kubeless.io/docs/quick-start/ versão 1.05

    ```console
    $ RELEASE=$(curl -s https://api.github.com/repos/kubeless/kubeless/releases/latest | grep tag_name | cut -d '"' -f 4)
    
    $ kubectl create ns kubeless

    $ kubectl create -f https://github.com/kubeless/kubeless/releases/download/$RELEASE/kubeless-$RELEASE.yaml
    ```

* instalando kafka para o kubeless:

    * vamos usar kafka-zookeeper.yaml funciona na versão 1.16 do kubernetes e 1.4.0 minikube

    ```console
    $ kubectl create -f kubeless/forum/kafka-zookeeper-v1.0.2.yaml
    ```

* ativando o ingress do nginx para service discovery

    ```console
    $ minikube addons enable ingress
    ```

### Especifico para o forum

* mongo db

    ```console
    $ kubectl create -f kubeless/forum/mongodb.yml
    ```

### inicio do desenvolvimento

#### criação de arquivos

* Criamos o handler de criação de novo artigo no arquivo index.js
* em seguida vamos cadastrar nossa função no kubeless informando o ambiente de execução, as dependencias, a função de entrada e o arquivo.
	`$ kubeless function deploy create-article --runtime nodejs8 --dependencies package.json --handler index.createArticle --from-file index.js`
* feito isso precisamos cadastrar o evento que vai disparar a função, no caso o path /create
	`$ kubeless trigger http create create-article --function-name create-article --path create --hostname localhost`
* finalmente vamos criar o topico do kafka de criação de tópico
	`$ kubeless topic create new-article-topic`

* teoricamente tinhamos que fazer um curl para http://localhost/create para ativar a função
**problema para expor o serviço olhar: https://kubernetes.io/docs/tasks/access-application-cluster/ingress-minikube/**

