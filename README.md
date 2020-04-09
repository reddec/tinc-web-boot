# tinc-web-boot
Web desktop tinc control panel and management

The project aimed to be a successor of [tinc-boot](https://github.com/reddec/tinc-boot) project and be more freindly for newcomers.

tinc-boot nodes are capable with the tinc-web-boot nodes.

Status: **draft**

## Features

| Status | Description |
|--------|-------------|
| done   | one-click network generation |
| in-progress | windows all-in-one build |
| in-progress | linux packaging |
| in-progress | freindly UI |
| done | nodes hosts synchornizations (with versions) |
| done | auto-start browser on double-click |
| in-progress | server mode (no browser launch) |
| planned | optional adminstrator authorization |
| in-progress | one-click sharing by URL |
| planned | define an exit node |

## API

Please see [API documentation](API.md), it's autogenerated and always actual.

## Build

* For backend requires go 1.13+
* For frontend requires npm

### Backend

```
go build -v -o tinc-web-boot cmd/tinc-web-boot/main.go
```

## Run (for development)

```
sudo ./tinc-web-boot run --dev
```
