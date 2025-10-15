# Senhorio Feudal

Jogo 2D minimalista em HTML5 Canvas e TypeScript sobre a arte de governar um feudo medieval. Administre recursos, negocie com seus vassalos e atravesse invernos rigorosos mantendo a lealdade da corte.

## Requisitos

- macOS (testado em MacBook M1) ou qualquer sistema com Node.js LTS
- Node.js 18 LTS ou superior
- npm 9+

### Instalação no macOS (Apple Silicon)

```bash
brew install node
npm ci
```

## Uso

```bash
npm run dev       # inicia servidor de desenvolvimento Vite
npm run build     # gera build de produção
npm run preview   # serve build para validação
npm run test      # executa testes Vitest
npm run lint      # analisa lint
npm run format    # formata o código com Prettier
```

Para verificar build + preview de uma vez:

```bash
npm run build && npm run preview
```

## Como Jogar

- Objetivo: sobreviver a 12 turnos mantendo **lealdade média ≥ 60** e **ouro ≥ 200**.
- Cada turno representa uma estação do ano. Use ações à direita para ajustar impostos, oferecer festas, fortalecer defesas ou investir.
- Pressione **Espaço/Enter** ou clique no painel de eventos para avançar o turno.
- Teclas rápidas: `1` aumentar impostos, `2` reduzir impostos, `3` conceder festa, `D` convocar defesa, `I` investir. `P` pausa, `R` reinicia campanha.
- Vitória: alcançar as metas de lealdade e ouro ao final dos turnos.
- Derrota: fome prolongada (comida negativa por 2 turnos), falência (ouro negativo por 2 turnos) ou motim (lealdade média < 25).

### Loop por Estação

- **Primavera/Verão**: produção de comida e tributos leves.
- **Outono**: coleta de impostos, ajuste de lealdade conforme taxas.
- **Inverno**: consumo intenso de comida, verificação de proteção, eventos aleatórios (raids, pragas, visita do rei etc.).

HUD apresenta recursos no topo, lista de vassalos à esquerda, ações à direita e registro de eventos abaixo.

## Seed, Dificuldade e Balanceamento

- Seed padrão é gerada na inicialização e exibida no autosave. Para alterar manualmente, edite `src/utils/seed.ts` ou salve o jogo, limpar o autosave (tecla `R`) e reiniciar com seed desejada em `criarEstadoInicial`.
- Parâmetros de balanceamento estão em `src/model/balance.ts` (alvos de vitória/derrota, valores de consumo, custos). Ajuste-os para criar modos mais difíceis ou acessíveis.

## Estrutura do Projeto

```
/public        # assets estáticos
/src
  /core        # loop de jogo, relógio e RNG
  /model       # tipos, estado e tabelas de balanceamento/eventos
  /systems     # regras de economia, lealdade, eventos e IA
  /ui          # renderização Canvas, input, layout e strings
  /utils       # helpers (seed, armazenamento)
  main.ts      # ponto de entrada do jogo
/tests         # testes Vitest
```

### Pontos de Extensão

- Novos eventos: adicione a `src/model/events.ts` e ajuste probabilidades.
- Novos vassalos: edite `src/model/balance.ts` (lista inicial) ou carregue via JSON externo.
- Novas ações: implemente em `src/systems/turns.ts` e crie botões no HUD (`src/ui/renderer.ts`).
- Persistência avançada: `src/utils/storage.ts` pode ser estendido para múltiplos slots ou nuvem.

## Troubleshooting

| Problema | Solução |
| --- | --- |
| Porta 5173 ocupada | Execute `npm run dev -- --port 5174` ou finalize o processo existente (`lsof -i :5173`). |
| Mudanças não aparecem | Limpe cache do navegador (`Cmd+Shift+R`) e garanta que `npm run dev` está ativo. |
| Erro ao salvar | Limpe armazenamento local nas DevTools (`Application > Local Storage`). |
| Tipagem falha na build | Rode `npm ci` novamente para garantir dependências corretas. |

## Testes

- Economia: impostos nunca ficam negativos e consumo depende da população (`tests/economy.test.ts`).
- Lealdade: reage a impostos e defesa (`tests/loyalty.test.ts`).
- Eventos: probabilidades válidas e efeitos aplicados (`tests/events.test.ts`).

Execute `npm run test` para validar.

## Changelog

- **1.0.0** – Primeira versão jogável com autosave, eventos aleatórios, IA de vassalos e HUD completo.

## Próximos Passos

- Adicionar trilha sonora ambiente e efeitos de feedback.
- Introduzir diplomacia entre vassalos e disputas territoriais.
- Implementar mapa tático simplificado com posicionamento de tropas.
