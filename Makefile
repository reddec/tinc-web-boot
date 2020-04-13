install: backend

tools:
	GO111MODULE=off go get -v github.com/go-bindata/go-bindata/...
	GO111MODULE=off go get -v github.com/reddec/struct-view/cmd/events-gen
	GO111MODULE=off go get -v github.com/reddec/jsonrpc2/cmd/...

ui:
	cd web/ui && npm i && npm run build

regen: tools ui
	PATH="$(PATH):$(shell go env GOPATH)/bin" go generate web/routes.go
	PATH="$(PATH):$(shell go env GOPATH)/bin" go generate web/internal/*.go
	PATH="$(PATH):$(shell go env GOPATH)/bin" go generate network/event_types.go

backend: regen
	go build -o tinc-web-boot -v ./cmd/tinc-web-boot/main.go

linux:
	mkdir -p build
	GOOS=linux go build -o build/tinc-web-boot -v ./cmd/tinc-web-boot/main.go

darwin:
	mkdir -p build
	GOOS=darwin go build -o build/tinc-web-boot -v ./cmd/tinc-web-boot/main.go

windows:
	mkdir -p build
	GOOS=windows go build -o build/tinc-web-boot -v ./cmd/tinc-web-boot/main.go

checkplatform: linux windows darwin

.PHONY: install