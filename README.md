
# TaskFlow — Gerenciamento de Projetos e Tarefas

Aplicação full stack para organização de projetos e tarefas, desenvolvida com React, TypeScript, Django REST Framework e MySQL.

O TaskFlow foi criado como projeto de portfólio com foco em desenvolvimento web, construção de APIs REST, autenticação, controle de acesso e persistência de dados relacionais.

## Funcionalidades

- **Cadastro de usuários:** criação de contas para acesso à aplicação.
- **Autenticação JWT:** proteção dos endpoints por autenticação baseada em tokens.
- **Gerenciamento de projetos:** criação, consulta, edição e exclusão de projetos.
- **Gerenciamento de tarefas:** organização de tarefas vinculadas a projetos.
- **Status e prioridades:** classificação das tarefas para facilitar o acompanhamento.
- **Resumo de projetos:** consulta da quantidade de tarefas por status.
- **Filtros e pesquisas:** consulta de tarefas por projeto, status e prioridade, além de pesquisa por texto.
- **Documentação da API:** documentação interativa com Swagger/OpenAPI.
- **Testes automatizados:** testes de API para cadastro, criação de tarefas e controle de acesso.
- **Ambiente conteinerizado:** execução dos serviços com Docker Compose.

## Tecnologias utilizadas

| Área | Tecnologias |
|---|---|
| Frontend | React, TypeScript e Vite |
| Backend | Python, Django e Django REST Framework |
| Banco de dados | MySQL |
| Autenticação | JWT |
| Documentação da API | Swagger e OpenAPI |
| Filtros e consultas | django-filter e filtros do Django REST Framework |
| Ambiente de desenvolvimento | Docker e Docker Compose |
| Testes | Django REST Framework — testes de API |

## Como executar o projeto

### Pré-requisitos

Antes de começar, instale:

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

O Docker Desktop deve estar em execução.

### 1. Clone o repositório

```bash
git clone https://github.com/naju-dias/taskflow.git
cd taskflow
```

### 2. Configure as variáveis de ambiente

Crie o arquivo `.env` a partir do exemplo disponibilizado no projeto.

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux ou macOS:

```bash
cp .env.example .env
```

Confira as variáveis do arquivo `.env` e ajuste os valores necessários ao seu ambiente local.

**Importante:** utilize credenciais próprias para desenvolvimento. O arquivo `.env` contém configurações locais e não deve ser enviado ao GitHub.

### 3. Inicie os serviços

Na raiz do projeto, execute:

```bash
docker compose up --build -d
```

Para verificar o estado dos serviços:

```bash
docker compose ps
```

Para acompanhar os logs:

```bash
docker compose logs -f
```

### 4. Acesse a aplicação

Com os serviços iniciados, acesse os endereços configurados no `docker-compose.yml`.

- **Frontend:** endereço e porta configurados para o servidor Vite.
- **Backend:** endereço e porta configurados para o Django.
- **Documentação da API:** rota do Swagger configurada no backend.

As portas e rotas exatas podem ser consultadas nos arquivos de configuração do projeto.

## API REST

A API disponibiliza endpoints para cadastro de usuários, gerenciamento de projetos e gerenciamento de tarefas.

| Endpoint | Descrição |
|---|---|
| `/api/auth/register/` | Cadastro de usuários |
| `/api/projects/` | Listagem e criação de projetos |
| `/api/projects/{id}/` | Consulta, edição e exclusão de projetos |
| `/api/projects/{id}/summary/` | Resumo das tarefas de um projeto |
| `/api/tasks/` | Listagem e criação de tarefas |
| `/api/tasks/{id}/` | Consulta, edição e exclusão de tarefas |

Os endpoints protegidos exigem autenticação conforme as permissões configuradas na API.

A listagem de tarefas oferece filtros por status, prioridade e projeto, além de recursos de pesquisa e ordenação.

Consulte a documentação Swagger para conferir os parâmetros, os formatos das requisições e as respostas de cada endpoint.

## Segurança e controle de acesso

O backend implementa regras para restringir o acesso aos dados de cada usuário.

- As consultas de projetos são filtradas pelo proprietário autenticado.
- As tarefas possuem associação com o usuário responsável e o projeto correspondente.
- A criação e a atualização de tarefas validam a propriedade do projeto associado.
- Os endpoints utilizam autenticação e permissões configuradas no Django REST Framework.
- As operações de acesso são verificadas por testes automatizados.

Essas medidas ajudam a impedir que um usuário acesse ou associe tarefas a projetos pertencentes a outra conta.

## Testes automatizados

Para executar os testes do backend, utilize:

```bash
docker compose exec backend python manage.py test
```

A suíte atual contém cinco testes de API que verificam:

- Cadastro de usuários.
- Acesso aos próprios projetos.
- Restrição de acesso aos projetos de outros usuários.
- Criação de tarefas em projetos autorizados.
- Rejeição da criação de tarefas em projetos de outros usuários.

**Última verificação:** os cinco testes passaram na execução local.

## Estrutura do projeto

```text
taskflow/
├── backend/
│   ├── config/          # Configurações do Django
│   ├── tasks/           # Modelos, serializers, views e testes
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/            # Aplicação React + TypeScript
├── docs/                # Documentação complementar
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Decisões de desenvolvimento

### Separação entre frontend e backend

A interface se comunica com uma API REST dedicada, separando a apresentação da aplicação das regras de negócio e do acesso aos dados.

### Controle de propriedade dos recursos

As consultas são limitadas aos dados do usuário autenticado. As operações com tarefas também verificam se o projeto associado pertence ao usuário.

### Persistência relacional

O MySQL armazena os dados em uma estrutura relacional, permitindo representar os vínculos entre usuários, projetos e tarefas.

### Ambiente reproduzível

O Docker Compose facilita a inicialização dos serviços e reduz a necessidade de configurar manualmente as dependências do backend na máquina local.

### Testes automatizados

Os testes de API verificam fluxos importantes e regras de acesso, ajudando a identificar regressões durante a evolução do projeto.

## Melhorias planejadas

- [ ] Adicionar capturas de tela da interface.
- [ ] Ampliar os testes para atualização e exclusão de recursos.
- [ ] Expandir a validação de entradas inválidas.
- [ ] Aprimorar os estados de carregamento e tratamento de erros do frontend.
- [ ] Configurar integração contínua para execução automática dos testes.
- [ ] Preparar uma versão publicada para demonstração.

## Autora

**Ana Julia Alves Dias**

Estudante de Engenharia de Software, com interesse em desenvolvimento full stack, backend, dados, computação em nuvem e segurança da informação.

- **GitHub:** [@naju-dias](https://github.com/naju-dias)
- **Portfólio:** [najudias.vercel.app](https://najudias.vercel.app)

---

Desenvolvido como projeto de portfólio para praticar desenvolvimento full stack, construção de APIs REST, autenticação e testes de software.
