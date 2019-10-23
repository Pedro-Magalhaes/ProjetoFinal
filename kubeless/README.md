
## Site do kubeless
https://kubeless.io/
### Docs
https://kubeless.io/docs/ 

## Tutoriais

### Criando uma rota ingress no minikube
* https://kubernetes.io/docs/tasks/access-application-cluster/ingress-minikube/
* https://medium.com/@awkwardferny/getting-started-with-kubernetes-ingress-nginx-on-minikube-d75e58f52b6c
### Criando um http trigger para o kubeless:
https://kubeless.io/docs/http-triggers/
Temos que ter o nginx rodando
Após criar a função pelo kubeless podemos criar a rota ingress para expor a função para fora do cluster usando o comando:

```console
$ kubeless trigger http create create-article --function-name create-article --namespace forum

```
Mais sobre o comando trigger em: <https://kubeless.io/docs/http-triggers/>

O acesso ao dashboard do minikube é feito pelo comando: `$ minikube dashboard `


