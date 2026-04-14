# PRD: Signal Lab – Observability Playground с AI-слоем для Cursor

## 1. Общая цель
Построить работающее приложение «Signal Lab», которое генерирует метрики, логи и ошибки по нажатию кнопки в UI, а также содержит AI-слой (skills, rules, commands, hooks, orchestrator), позволяющий Cursor автономно развивать и поддерживать проект.

## 2. Требования к платформе (PRD 001 – Platform Foundation)

**2.1 Технологический стек (замена любого элемента – штраф без веской причины)**
- Frontend: Next.js (App Router), shadcn/ui, Tailwind CSS, TanStack Query, React Hook Form
- Backend: NestJS (REST API)
- База данных: PostgreSQL, Prisma ORM
- Observability: Prometheus, Loki, Grafana, Sentry
- Infrastructure: Docker Compose – единая команда для поднятия всех сервисов

**2.2 Функциональные требования**
- UI (Next.js):
  - Форма (React Hook Form) для выбора сценария (system_error, high_latency, business_alert)
  - Кнопка «Run Scenario» – POST /api/scenarios
  - История запусков (TanStack Query) – последние 10 запусков
  - Ссылки на Grafana, Loki, Sentry
- Backend (NestJS):
  - ScenarioController → ScenarioService
  - При запросе: сохранение в PostgreSQL, генерация метрики (Prometheus), лога (Loki), ошибки (Sentry)
  - Эндпоинт /metrics для Prometheus

**2.3 Инфраструктура (Docker Compose)**
Сервисы: app, postgres, prometheus, loki, grafana, sentry (облачный DSN)

**2.4 Критерии проверки**
- docker compose up -d – всё стартует
- http://localhost:3000 – UI работает
- После нажатия кнопки: метрика в Prometheus, лог в Loki, ошибка в Sentry
- Дашборд Grafana показывает сигналы

## 3. Требования к observability-демо (PRD 002 – Scenarios & Signals)

**3.1 Сценарии (минимум 3)**
1. system_error – исключение, лог ошибки, метрика errors_total
2. high_latency – задержка 500ms, лог WARN, метрика request_duration_seconds
3. business_alert – лог INFO с event: "business_alert", метрика business_events_total

**3.2 Генерация сигналов**
- Метрики: prom-client в NestJS, экспорт на /metrics
- Логи: структурные логи с транспортом к Loki (push API)
- Ошибки: @sentry/nestjs

**3.3 Дашборд Grafana**
Provisioned дашборд: график метрик, таблица логов, счётчик ошибок

## 4. Требования к AI-слою Cursor (PRD 003 – Cursor AI Layer)

**4.1 Структура .cursor/**
.cursor/
  rules/
    stack-rules.md
    conventions.md
    guardrails.md
  skills/
    observability-skill.md
    testing-skill.md
    deploy-skill.md
  commands/
    /new-scenario
    /add-metric
    /run-observability
  hooks/
    pre-commit.hook
    post-commit.hook

**4.2 Marketplace skills (минимум 6)** – перечислить в README

**4.3 Custom skills (минимум 3)**
- observability-skill: инструкция по добавлению observability-сценария
- ui-component-skill: генерация формы на shadcn/ui
- db-migration-skill: безопасное создание миграций Prisma

**4.4 Команды (минимум 3)**
- /new-scenario <name> – создаёт файлы для нового сценария
- /check-obs – проверяет доступность Prometheus, Loki, Grafana, Sentry
- /add-dashboard – генерирует JSON для панели Grafana

**4.5 Хуки (минимум 2)**
- pre-commit: проверка docker-compose.yml и отсутствие console.log
- post-commit: проверка CHANGELOG.md

## 5. Требования к orchestrator skill (PRD 004 – Small-model orchestrator)

**5.1 Концепция**
Orchestrator получает высокоуровневую задачу, декомпозирует на атомарные подзадачи, вызывает соответствующие skills/команды, экономит контекст

**5.2 Пример работы**
Пользователь: @orchestrator добавь сценарий payment_failure
Оркестратор генерирует план и пошагово выполняет через другие skills

**5.3 Требования**
- Skill в .cursor/skills/orchestrator.md
- Минимальный контекст, обработка ошибок
- Умение делегировать подзадачи малым моделям

## 6. Документация (в README)
- Запуск: docker compose up -d
- Проверка: инструкция демонстрации (нажать кнопку → увидеть в Grafana/Loki/Sentry)
- Описание AI-слоя: все skills, rules, commands, hooks, marketplace-скиллы
- Ссылки на сервисы: localhost:3000, :3001/metrics, :9090, :3100, :3000/grafana

## 7. Критерии сдачи
- git clone && docker compose up -d – работает
- UI открывается, кнопка нажимается
- Метрика выросла (Prometheus/Grafana)
- Лог появился (Loki)
- Ошибка зафиксирована (Sentry)
- .cursor/ полностью заполнен
- Orchestrator skill работает в новом чате Cursor

