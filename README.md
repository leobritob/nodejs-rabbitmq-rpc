# Node.js RabbitMQ RPC
Esse repositório realiza uma implementação de um client com NodeJS e um server RabbitMQ, aplicando o conceito RPC.

## Node.js
NodeJS é uma das maiores criações da tecnologia que já se existiu, é uma plataforma que podemos escrever javascript para front-end e back-end, automatizar processos, desenvolver APIs, realizar comunicação em tempo real e muito mais, tudo isso com apenas uma linguagem, Javascript.

NodeJS é leve e multiplataforma e foi criado por Ryan Dahl em 2009 e seu funcionamento gira em torno do motor V8, o mesmo utilizado no navegador do Google Chrome.

## RabbitMQ
RabbitMQ é um Message Broker que foi criado em 2007 pela Rabbit Technologies, desenvolvido na linguagem Erlang e tem suporte ao protocolo de mensagens AMQP(Advanced Message Queuing Protocol) suportando troca de mensagens assíncronas. Além de ser multiplataforma é compatível com diversas linguagens de programação, é considerado rápido, confiável e adequado em cenários de alta disponibilidade.

Se fizermos uma rápida analogia, podemos dizer que o RabbitMQ é uma caixa postal, uma agência postal e um carteiro, recepcionando cartas(mensagens) e encaminhando a seus destinatários.

Antes de continuarmos vamos entender alguns conceitos dos jargões utilizados no RabbitMQ:

* Producer – É um publicador de mensagens
* Queue – É caixa postal – Local onde são armazenadas as mensagens
* Consumer – Espera e recebe as mensagens

## RPC
A sigla RPC é um acrônimo de Remote Procedure Call(Chamada de Procedimento Remoto), sendo um padrão de comunicação que nos ajuda a executar funções em um computador remoto e aguardar o seu resultado, é como se chamássemos uma função da nossa aplicação, mas essa função está em outro computador. RPC facilita a comunicação entre client/server e veremos na prática como realizar a comunicação do nosso client rodando com NodeJS, que enviará uma requisição, passando por um message broker e aguardando a resposta processada pelo server.

O padrão RPC permite uma arquitetura resiliente já que estamos utilizando filas para armazenamento de mensagens e garantimos o processamento de eventos entre client e server.

![RPC](https://lh6.googleusercontent.com/_JvqVGQx6mSv6k-Bj1HSZ8541U8fdQrZwkHov957MywJpT4GAvip56pgFIqtNkOqVcJ7jgxMlydUhJLqZnNMqZ-Zp8A1p6x5NgTAkb5fyKksX5QZtz7GACh6X2JVJz_GPBmaEeq- "RPC")

## Neste diagrama podemos entender que:

* Quando o client é iniciado é criada uma fila de callback, exclusiva e anônima, onde o server irá retornar o resultado para o client. A fila é o local onde será armazenada a mensagem e posteriormente consumida pelo Server.
* Para uma chamada RPC é necessário que o client envie duas propriedades importantes:
reply_to – nome da fila de retorno da chamada callback.
correlation_id – identificador único e exclusivo da solicitação.
* Quando o client envia a solicitação para o server ele publica a mensagem em uma fila chamada rpc_queue.
* O server está aguardando solicitações na fila rpc_queue. Quando aparecer uma nova solicitação, então, ele faz o trabalho de processamento e publica o resultado de volta para o client usando a fila de retorno definida pelo client na propriedade reply_to.
* E por fim, o client aguarda os dados de retorno e quando a mensagem aparece ele verifica se a mensagem que chegou é a que ele esperava e isso ele identifica pela propriedade correlation_id.

## Cenário
Imaginemos que estamos no período mais movimentado do comércio eletrônico: Black Friday.

Desenvolveremos uma aplicação que fará requisições em uma API, mas mesmo que o servidor esteja indisponível as requisições não serão perdidas e serão processadas posteriormente.

![Chamada HTTP 1](https://lh5.googleusercontent.com/Rxhwair_N96VX-n2208k9_kuoZ21Q83EaNzrhtYdxpmPRGb8NBGbBA1n3xaKWgW04hsjPj3hQE63Da6o84up9D7IXhOLTDXs0pDv9L12biBAlN1PpIKxF1rjegZwhfMifJiAPTrm "Chamada HTTP 1")

Na imagem acima temos uma ilustração simples e sem problemas de um client enviando requisições para o server, a comunicação é feita via http e o server tem se mantido estável em seu processamento e retorna a resposta para o client sem problemas.

![Chamada HTTP 2](https://lh6.googleusercontent.com/HyOLXIhQXhn5R6m3JkdAjdpd9dkBt0q_SDDkGaFqTAc-AgLsultO_HHkwMZ_IgBcru6nrf8gqQKwrQwJ0LmeH2LPxnQLIFf0CBx3kWfS4r6T7Enm4SKdsG5GMZ5MoljfmFayeV7z "Chamada HTTP 2")

Mas agora entramos na semana da Black Friday e o server está sendo requisitado por diversos clients. Começou a apresentar problemas ao processar as requisições, dependendo da gravidade do problema poderá ficar indisponível por um pequeno, médio ou longo período de tempo.

Neste cenário podemos considerar que todas as requisições estão perdidas, mas e agora ? Como podemos contornar este cenário ?

## Solução
Umas das soluções é utilizarmos chamadas RPC entre client e server, com este padrão de comunicação implementado com RabbitMQ, conseguiremos garantir que as requisições serão processadas após o servidor retornar à sua disponibilidade.

## Referências
https://www.wevo.io/utilizando-o-conceito-rpc-com-nodejs-e-rabbitmq/