package network

import "strings"

const (
	CommunicationPort = 1655
)

type Config struct {
	Name      string   `json:"name"`
	Port      uint16   `json:"port"`
	Interface string   `json:"interface"`
	AutoStart bool     `json:"autostart"`
	Mode      string   `json:"mode"`
	ConnectTo []string `json:"connectTo,omitempty"`
}

type Address struct {
	Host string `json:"host"`
	Port uint16 `json:"port,omitempty"`
}

type Upgrade struct {
	Subnet  string    `json:"subnet"`
	Port    uint16    `json:"port"`
	Address []Address `json:"address,omitempty"`
}

type Node struct {
	Name      string    `json:"name"`
	Subnet    string    `json:"subnet"`
	Port      uint16    `json:"port"`
	Address   []Address `json:"address,omitempty"`
	PublicKey string    `json:"publicKey"`
	Version   int       `json:"version"`
}

func (n *Node) IP() string {
	return strings.TrimSpace(strings.Split(n.Subnet, "/")[0])
}
