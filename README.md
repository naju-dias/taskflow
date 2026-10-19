# TaskFlow

Aplicação full stack para organizar projetos e tarefas. Projeto de portfólio com foco em API REST, autenticação JWT, controle de acesso e banco relacional.

**Stack:** React, TypeScript e Vite no frontend; Django REST Framework no backend; MySQL; Docker Compose.

## ✨ Funcionalidades

- Cadastro de usuários e login com JWT
- Projetos e tarefas com criação, edição e exclusão
- Status e prioridade nas tarefas, com resumo por status em cada projeto
- Filtros por projeto, status e prioridade, além de busca por texto e ordenação
- Cada usuário acessa apenas os próprios dados
- Documentação interativa da API (Swagger/OpenAPI)
- Testes automatizados de API

## 🚀 Como executar

Requisitos: [Git](https://git-scm.com/) e [Docker Desktop](https://www.docker.com/products/docker-desktop/) em execução.

```bash
git clone https://github.com/naju-dias/taskflow.git
cd taskflow
cp .env.example .env   # no PowerShell: Copy-Item .env.example .env
docker compose up --build -d
```

Depois, abra **http://localhost:8080**.

Revise as credenciais no `.env` antes de usar. O arquivo contém configurações locais e não deve ir para o GitHub.

## 📡 API

| Endpoint | Descrição |
|---|---|
| `/api/auth/register/` | Cadastro de usuários |
| `/api/projects/` | Lista e cria projetos |
| `/api/projects/{id}/` | Consulta, edita e exclui um projeto |
| `/api/projects/{id}/summary/` | Resumo das tarefas do projeto |
| `/api/tasks/` | Lista e cria tarefas (aceita filtros, busca e ordenação) |
| `/api/tasks/{id}/` | Consulta, edita e exclui uma tarefa |

Os endpoints, parâmetros e respostas estão detalhados no Swagger.

## 🔑 Controle de acesso

- Projetos são filtrados pelo usuário autenticado.
- Ao criar ou editar uma tarefa, o backend confere se o projeto pertence ao usuário.
- Essas regras são cobertas por testes automatizados.

## 🧪 Testes

```bash
docker compose exec backend python manage.py test
```

Cinco testes de API: cadastro, acesso aos próprios projetos, bloqueio de projetos de outros usuários, criação de tarefas em projetos permitidos e rejeição em projetos de terceiros.

## 🧩 Estrutura

```text
backend/    API Django (config/ e tasks/ com modelos, serializers, views e testes)
frontend/   Aplicação React + TypeScript
docs/       Documentação complementar
```

## 🎯 Próximos passos

- [ ] Capturas de tela da interface
- [ ] Testes de atualização e exclusão
- [ ] Integração contínua para rodar os testes
- [ ] Versão publicada para demonstração

## Autora

**Ana Julia Alves Dias**, estudante de Engenharia de Software.
[GitHub](https://github.com/naju-dias) · [Portfólio](https://najudias.vercel.app)
