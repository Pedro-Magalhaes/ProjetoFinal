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



### inicio do desenvolvimento

#### Criar o namespace para as funções

Podemos dar deploy no arquivo forum-namespace.yaml ou usar o comando abaixo:

`$ kubectl create ns forum`

### Deploy do banco MongoDB

* mongo db

    ```console
    $ kubectl create -n forum -f kubeless/forum/mongodb.yml
    ```

#### criação das funções

Primeiramente para nos certificarmos que o as funções vão ser acessiveis fora do minikube vamos definir um url host para nossas funções e colocaremos no /etc/hosts apontando para o endereço ip do minikube.

Para esse exeplo vou usar o host " kubeless.forum " para todas as funções e cada função vai estar em um "path" diferente. Ou seja, a função create vai ser acessada usando "kubeless.forum/create", a list "kubeless.forum/list" ...

Para adicionar nosso host ao /etc/hosts podemos utilizar o segunte comando:

```console
$ echo "$(minikube ip) kubeless.forum" | sudo tee -a /etc/hosts
```

##### create-article

Função que vai receber a requisição http para a criação de um tópico e gerar uma mensagem no kafka

* Criamos o handler de criação de novo artigo no arquivo index.js
* em seguida vamos cadastrar nossa função no kubeless informando o ambiente de execução, as dependencias, a função de entrada e o arquivo.
	`$ kubeless function deploy create-article --namespace forum --runtime nodejs8 --dependencies package.json --handler index.createArticle --from-file index.js`
* feito isso precisamos cadastrar o evento que vai disparar a função, no caso o path /create
	`$ kubeless trigger http create create-article --namespace forum --function-name create-article --hostname kubeless.forum --path get`
* finalmente vamos criar o topico do kafka de criação de tópico
	`$ kubeless topic create new-article-topic`

Ao final podemos ver a url criada para acessar a função:

`$ kubectl get ing -n forum`

* para criar um tópico temos que fazer um curl para a url no path definido

```console
$ curl kubeless.forum/create --data '{"title": "My first post", "body": "This is my first post"}' -H "Content-type: application/json"
```


##### persist-article

O persist vai receber o evento do kafka quando o create-article mandar uma mensagem para o kafka no topico "new-article-topic"

* deploy

`$ kubeless function deploy persist-article --namespace forum --runtime nodejs8 --dependencies package.json --handler index.persistArticle --from-file index.js`

* trigger do kafka

`$ kubeless trigger kafka create persist-article --namespace forum --function-selector created-by=kubeless,function=persist-article --trigger-topic new-article-topic`

##### list-articles

A função list-articles vai ser responsavel por consultar o banco e listar todos os tópicos existentes

* deploy

`$ kubeless function deploy list-articles --namespace forum --runtime nodejs8 --dependencies package.json --handler index.listArticles --from-file index.js`

* trigger http

`$ kubeless trigger http create list-articles --function-name list-articles --hostname kubeless.forum --path list --namespace forum`

##### get-article

A função get-article vai receber um id por parametro e retornar o tópico corespondente

* deploy

`$ kubeless function deploy get-article --namespace forum --runtime nodejs8 --dependencies package.json --handler index.getArticle --from-file index.js`

* trigger http

`$ kubeless trigger http create get-article --function-name get-article --hostname kubeless.forum --path get --namespace forum`


**problema para expor o serviço olhar: https://kubernetes.io/docs/tasks/access-application-cluster/ingress-minikube/**

**SOLUÇÂO:**
Criar um host para as funções e vincular o host ao ip do minikube no arquivo /etc/hosts.
Assim conseguimos repassar as chamadas externas ao minikube para as funções criadas.
