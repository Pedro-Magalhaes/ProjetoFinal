# Forum

Url do exemplo:

<https://pusher.com/tutorials/realtime-blog-kubeless>

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

#### Criar o namespace para as funções

Podemos dar deploy no arquivo forum-namespace.yaml ou usar o comando abaixo:

`$ kubectl create ns forum`


#### criação das funções

##### create-article

Função que vai receber a requisição http para a criação de um tópico e gerar uma mensagem no kafka

* Criamos o handler de criação de novo artigo no arquivo index.js
* em seguida vamos cadastrar nossa função no kubeless informando o ambiente de execução, as dependencias, a função de entrada e o arquivo.
	`$ kubeless function deploy create-article --namespace forum --runtime nodejs8 --dependencies package.json --handler index.createArticle --from-file index.js`
* feito isso precisamos cadastrar o evento que vai disparar a função, no caso o path /create
	`$ kubeless trigger http create create-article --namespace forum --function-name create-article`
* finalmente vamos criar o topico do kafka de criação de tópico
	`$ kubeless topic create new-article-topic`

Ao final temos que ver a url criada para acessar a função:

`$ kubectl get ing -n forum`

* para criar um tópico temos que fazer um curl para a url

```console
$ ARTICLE_URL=$(kubectl get ing -n forum | grep create-article | awk '{print $2}')
$ curl $ARTICLE_URL --data '{"title": "My first post", "body": "This is my first post"}' -H "Content-type: application/json"
```


##### persist-article

O persist vai receber o evento do kafka quando o create-article mandar uma mensagem para o kafka no topico "new-article-topic"

* deploy

`$ kubeless function deploy persist-article --namespace forum --runtime nodejs8 --dependencies package.json --handler index.persistArticle --from-file index.js`

* trigger do kafka

`$ kubeless trigger kafka create persist-article --namespace forum --function-selector created-by=kubeless,function=persist-article --trigger-topic new-article-topic`


**problema para expor o serviço olhar: https://kubernetes.io/docs/tasks/access-application-cluster/ingress-minikube/**

