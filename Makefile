install: backend

clean:
	rm -rf build

bindata:
	GO111MODULE=off go get -v github.com/go-bindata/go-bindata/...

tools: bindata
	GO111MODULE=off go get -v github.com/reddec/struct-view/cmd/events-gen
	GO111MODULE=off go get -u -v github.com/reddec/jsonrpc2/cmd/...

generate: tools
	grep -Ril '//go:generate' --include '*.go' . | xargs -n 1 go generate

ui:
	cd web/ui && npm i && npm run build

regen: bindata ui
	PATH="$(PATH):$(shell go env GOPATH)/bin" go generate web/routes.go

backend: regen clean
	go build -o build/tinc-web-boot -v ./cmd/tinc-web-boot/

linux: clean
	mkdir -p build
	GOOS=linux go build -o build/tinc-web-boot -v ./cmd/tinc-web-boot/

darwin:
	mkdir -p build
	GOOS=darwin go build -o build/tinc-web-boot -v ./cmd/tinc-web-boot/

windows:
	mkdir -p build
	GOOS=windows go build -o build/tinc-web-boot.exe -v ./cmd/tinc-web-boot/

build:
	rm -rf build && mkdir -p build
	go build -o build/tinc-web-boot -v ./cmd/tinc-web-boot/

clean-test: build
	rm -rf networks && sudo ./build/tinc-web-boot run --dev --headless

vagrant: build
	mkdir -p build/alfa build/beta
	./build/tinc-web-boot run --dev --dev-gen-only --headless --dir build/alfa --dev-address 192.168.33.10
	./build/tinc-web-boot run --dev --dev-gen-only --headless --dir build/beta --dev-address 192.168.33.20
	cp build/alfa/example-network/hosts/* build/beta/example-network/hosts/
	cp -f build/beta/example-network/hosts/* build/alfa/example-network/hosts/

	vagrant up --provision
	sleep 10 # warm up

test-connectivity: vagrant
	test `curl -X POST --data-binary '{"jsonrpc":"2.0", "id": 1, "method": "TincWeb.Peers", "params": ["example-network"] }' 'http://127.0.0.1:18686/api' | \
		jq '[ .result[] | select(.status.fetched )] | length'` -eq 2 && echo "Connected!" || echo "Connectivity test FAILED"

deploy: linux
	rm -rf networks
	ansible-playbook -i deploy/docker_machine.yml deploy/dev_deploy.yml

test: test-connectivity

checkplatform: linux windows darwin

.PHONY: install build