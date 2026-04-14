# Чеклист сдачи

## Запуск

- [x] `docker compose up -d` поднимает весь стек
- [x] UI доступен по адресу `http://localhost:3000`
- [x] Backend отвечает на `http://localhost:3001/api/scenarios`
- [x] Метрики доступны на `http://localhost:3001/metrics`
- [x] Grafana доступна на `http://localhost:3002`
- [x] Grafana также открывается через прокси UI: `http://localhost:3000/grafana`

## Observability

- [x] `system_error` увеличивает `signal_lab_errors_total`
- [x] `high_latency` пишет `signal_lab_request_duration_seconds`
- [x] `business_alert` увеличивает `signal_lab_business_events_total`
- [x] Логи уходят в Loki и видны в дашборде Grafana / Explore
- [x] Sentry подключён через переменную `SENTRY_DSN`

## Слой Cursor AI

- [x] Есть каталог `.cursor/rules/`
- [x] Есть `.cursor/skills/` с навыками observability и orchestrator
- [x] Есть `.cursor/commands/` как минимум с тремя командами
- [x] Есть `.cursor/hooks/` как минимум с двумя полезными хуками
- [x] Есть `.cursor/hooks.json`

