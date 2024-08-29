# API para Leituras de Consumo

## Descrição

Este é um projeto de uma API RESTful desenvolvida em TypeScript/Express utilizando do Docker Compose para comunicação da API com o banco MongoDB. 
Ela fornece endpoints para criação, confirmação e listagem de leituras de consumo de água e gás.

## Instalação & Configuração

1. Clone este repositório em sua máquina local usando o comando:
```bash
   git clone https://github.com/caiosdeo/api-leitura-consumo.git
```

2. Navegue até o diretório do projeto:
```bash
   cd api-leitura-consumo
```
3. Configure as variáveis de ambiente. Crie um arquivo .env na raiz do projeto com base no arquivo `.env.example`.
   - GEMINI_API_KEY: Chave da API do Gemini

4. Para instalar e rodar a API, use Docker Compose:
```bash
    docker compose up -d
```

5. Para saber se já é possível usar a API, é só utilizar os logs:
```bash
    docker compose logs api
```

## Documentação da API

A URL base para todos os endpoints é: `http://localhost:3000`.

### Upload

Endpoint para criar uma nova leitura.

- **URL:** `/upload`
- **Método:** POST
- **Corpo da requisição:**
```json
{
    "customer_code": "a1b2c3",
    "measure_datetime": "2024-07-13",
    "measure_type": "gas",
    "image": "(string em base64)"
}
```

### Confirmar leitura

Endpoint para confirmar o valor de uma leitura existente.

- **URL**: `/confirm`
- **Método:** PATCH
- **Corpo da Requisição:**
```json
{
    "measure_uuid": "c281a367-2f46-4618-a699-3d1267f8caca",
    "confirmed_value": 24
}
```

### Listar leituras

Endpoint para listar as leituras de um cliente.

- **URL:** `/:customer_code/list`
- **Método:** GET
- **Parâmetros de rota:** `código` do cliente
- **Parâmetros de Consulta:**
  - `measure_type` (opcional): Filtro para tipo de leitura (padrão: nulo)