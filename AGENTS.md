# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

BspLightReSlopper (`bsplrs`) is a .NET 5.0 CLI tool that reverse-engineers light entity positions from baked Quake III / Jedi Outcast / Jedi Academy `.bsp` files. Single solution, no web services, no databases, no containers.

### Environment prerequisites

- **.NET 5.0 SDK** (pinned to `5.0.408` via `global.json`). This is an EOL runtime; the update script installs it automatically.
- **libssl1.1** is required by .NET 5.0 on Ubuntu 24.04 (which ships libssl3 only). The update script installs it from the `focal-security` repository.
- **`CLR_OPENSSL_VERSION_OVERRIDE=1.1`** must be set in the shell environment. Without this, `dotnet` will try to load libssl3 and abort with `Cannot get required symbol ERR_put_error from libssl`. The update script exports this, and it is also persisted in `~/.bashrc`.

### Build, test, and run

Standard commands per the README:

```bash
dotnet build                                          # Debug build
dotnet build -c Release                               # Release build
dotnet test                                           # Run all tests
dotnet run --project src/BspLightReSlopper -- help    # Run the CLI
```

### Test behavior without external assets

- 24 tests **auto-skip** when the `BSPLRS_JK2_ASSETS` env var is unset (no JK2 game data). This is expected.
- 3 `MapFileTests` report as "Failed" because `Xunit.SkipException` is rendered as a failure by the test runner — these are effectively skips for missing test fixture files (`grabtex.map`, regression maps). This is normal for a fresh clone without external data.
- 50 unit tests pass without any external data.

### Lint

There is no separate linter configured. The C# compiler warnings serve as the lint layer; `dotnet build` with 0 warnings is the quality gate.
