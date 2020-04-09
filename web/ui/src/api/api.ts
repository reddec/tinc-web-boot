export class TincWebError extends Error {
    public readonly code: number;
    public readonly details: any;

    constructor(message: string, code: number, details: any) {
        super(code + ': ' + message);
        this.code = code;
        this.details = details;
    }
}


export interface Network {
    name: string
    running: boolean
    config: Config | null
}

export interface Config {
    name: string
    port: number
    interface: string
    autostart: boolean
    connectTo: Array<string> | null
}

export interface PeerInfo {
    name: string
    online: boolean
    status: Peer | null
    config: Node | null
}

export interface Peer {
    node: string
    subnet: string
    fetched: boolean
}

export interface Node {
    name: string
    subnet: string
    port: number
    address: Array<Address> | null
    publicKey: string
}

export interface Address {
    host: string
    port: number | null
}

/**
Public Tinc-Web API (json-rpc 2.0)
**/
export class TincWeb {

    private __id: number;
    private readonly __url: string;
    private readonly __preflightHandler: any;


    // Create new API handler to TincWeb.
    // preflightHandler (if defined) can return promise
    constructor(base_url : string = 'http://127.0.0.1:8686/api', preflightHandler = null) {
        this.__url = base_url;
        this.__id = 1;
        this.__preflightHandler = preflightHandler;
    }


    /**
    List of available networks (briefly, without config)
    **/
    async networks(): Promise<Array<Network>> {
        return (await this.__call('Networks', {
            "jsonrpc" : "2.0",
            "method" : "TincWeb.Networks",
            "id" : this.__next_id(),
            "params" : []
        })) as Array<Network>;
    }

    /**
    Detailed network info
    **/
    async network(name: string): Promise<Network> {
        return (await this.__call('Network', {
            "jsonrpc" : "2.0",
            "method" : "TincWeb.Network",
            "id" : this.__next_id(),
            "params" : [name]
        })) as Network;
    }

    /**
    Create new network if not exists
    **/
    async create(name: string): Promise<Network> {
        return (await this.__call('Create', {
            "jsonrpc" : "2.0",
            "method" : "TincWeb.Create",
            "id" : this.__next_id(),
            "params" : [name]
        })) as Network;
    }

    /**
    Remove network (returns true if network existed)
    **/
    async remove(network: string): Promise<boolean> {
        return (await this.__call('Remove', {
            "jsonrpc" : "2.0",
            "method" : "TincWeb.Remove",
            "id" : this.__next_id(),
            "params" : [network]
        })) as boolean;
    }

    /**
    Start or re-start network
    **/
    async start(network: string): Promise<Network> {
        return (await this.__call('Start', {
            "jsonrpc" : "2.0",
            "method" : "TincWeb.Start",
            "id" : this.__next_id(),
            "params" : [network]
        })) as Network;
    }

    /**
    Stop network
    **/
    async stop(network: string): Promise<Network> {
        return (await this.__call('Stop', {
            "jsonrpc" : "2.0",
            "method" : "TincWeb.Stop",
            "id" : this.__next_id(),
            "params" : [network]
        })) as Network;
    }

    /**
    Peers brief list in network  (briefly, without config)
    **/
    async peers(network: string): Promise<Array<PeerInfo>> {
        return (await this.__call('Peers', {
            "jsonrpc" : "2.0",
            "method" : "TincWeb.Peers",
            "id" : this.__next_id(),
            "params" : [network]
        })) as Array<PeerInfo>;
    }

    /**
    Peer detailed info by in the network
    **/
    async peer(network: string, name: string): Promise<PeerInfo> {
        return (await this.__call('Peer', {
            "jsonrpc" : "2.0",
            "method" : "TincWeb.Peer",
            "id" : this.__next_id(),
            "params" : [network, name]
        })) as PeerInfo;
    }



    private __next_id() {
        this.__id += 1;
        return this.__id
    }

    private async __call(method: string, req: any): Promise<any> {
        const fetchParams = {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(req)
        };
        if (this.__preflightHandler) {
            await Promise.resolve(this.__preflightHandler(method, req, fetchParams));
        }
        const res = await fetch(this.__url, fetchParams);
        if (!res.ok) {
            throw new Error(res.status + ' ' + res.statusText);
        }

        const data = await res.json();

        if ('error' in data) {
            throw new TincWebError(data.error.message, data.error.code, data.error.data);
        }

        return data.result;
    }
}