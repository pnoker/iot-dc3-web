# ⚠️ Merged — this project now lives in [iot-dc3](https://github.com/pnoker/iot-dc3)

**This repository is archived and no longer maintained separately.** The frontend project `iot-dc3-web` has been merged into the [iot-dc3](https://github.com/pnoker/iot-dc3) monorepo under `dc3-web/`, sharing a single version number, CI/CD pipeline, and release process with the backend.

## Get the code

```bash
# GitHub
git clone https://github.com/pnoker/iot-dc3.git
# Gitee
git clone git@gitee.com:pnoker/iot-dc3.git

cd iot-dc3/dc3-web

pnpm install
pnpm dev
```

## Original README (kept for reference)

The content below is the pre-migration README — no longer updated.

---

## 1. Prepare

- `git`
- `Visual Studio Code`
- `nodejs` >= 22 (enforced by `engines` in `package.json`)
- `pnpm` 11.3.0 (pinned via `packageManager`), install using `corepack enable && corepack prepare pnpm@11.3.0 --activate`

## 2. Source code

```bash
# GitHub
git clone https://github.com/pnoker/iot-dc3.git
# Gitee
git clone git@gitee.com:pnoker/iot-dc3.git
```

## 3. Develop

```bash
cd iot-dc3/dc3-web

# install
pnpm install

# run
pnpm dev
```

The dev server runs on `http://localhost:8080` and proxies API calls to the backend
gateway (`http://localhost:8000`), so start the backend stack first.

## 4. More

For the full command surface (build, type-check, lint, unit/component/E2E tests), the
tech stack, environment configuration (`src/config/env/`), and project conventions, see
[`AGENTS.md`](./AGENTS.md).
