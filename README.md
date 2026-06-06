# PIB Cafelândia — Site institucional

Site moderno e responsivo da **Primeira Igreja Batista de Cafelândia**, com painel
administrativo completo. Construído em **React + Vite + Tailwind CSS** e integrado ao
backend **SAP CAP** (`service_pib`).

## ✨ Recursos

**Site público**
- Home com banner (hero), sobre/missão/visão, horários de culto, eventos em destaque e CTA de ofertas
- Páginas: Sobre, Agenda, Eventos (lista + detalhe), Contribua (PIX / dados bancários), Contato (formulário + mapa)
- Tema (cores, logo, textos, imagens) controlado 100% pelo painel — sem mexer no código

**Painel administrativo** (`/admin`)
- Login com JWT
- Dashboard com indicadores
- Configuração do site (identidade, cores, hero, sobre, pastor, contato, redes, contribuição, rodapé)
- CRUD de Eventos, Agenda/Cultos, Parceiros
- Inscrições recebidas pelo formulário
- Gestão de usuários (papéis admin/user, senha)

## 🚀 Como rodar

### 1. Backend (`service_pib`)
```bash
cd ../service_pib
npm install
npm start          # ou: cds watch  → sobe em http://localhost:4004
```
> Na primeira execução é criado automaticamente o usuário **admin / 123456**.
> Os segredos (banco + JWT) ficam em `service_pib/.cdsrc-private.json` (fora do git).

### 2. Frontend (este projeto)
```bash
npm install
npm run dev        # http://localhost:5173
```
Ajuste a URL do backend em `.env`:
```
VITE_API_URL=http://localhost:4004
```

### Build de produção
```bash
npm run build      # gera /dist
npm run preview    # serve o /dist localmente
```

## 🔐 Acesso ao painel
- URL: `/admin` (link discreto no rodapé do site)
- Usuário inicial: **admin**
- Senha inicial: **123456** → **altere em Usuários após o primeiro login**

> O OAuth2 pode ser adicionado depois, substituindo o fluxo de `login()` em
> `src/context/AuthContext.jsx` e `src/api/client.js`.

## 🗂️ Estrutura
```
src/
  api/client.js              # cliente OData (auth + CRUD)
  context/AuthContext.jsx    # autenticação JWT
  context/SiteConfigContext  # configuração do site + tema dinâmico
  components/                # Navbar, Footer, cards, admin (layout, modal, CRUD genérico)
  pages/                     # páginas públicas
  pages/admin/               # páginas do painel
  lib/format.js              # datas, dias da semana, horários
```

## 🔌 Integração com o backend
| Recurso        | Endpoint                                   |
|----------------|--------------------------------------------|
| Login          | `POST /odata/v4/auth/token`                |
| Conteúdo       | `GET /odata/v4/processor/<Entidade>`       |
| Escrita (admin)| `POST/PATCH/DELETE` com `Authorization: Bearer <token>` |

Leitura é pública; escrita exige token de **administrador**. Inscrições (`Subscriptions`)
podem ser criadas publicamente pelo formulário de contato.
