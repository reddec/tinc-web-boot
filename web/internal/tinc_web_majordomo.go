// Code generated by jsonrpc2. DO NOT EDIT.
package internal

import (
	"encoding/json"
	jsonrpc2 "github.com/reddec/jsonrpc2"
	network "tinc-web-boot/network"
	shared "tinc-web-boot/web/shared"
)

func RegisterTincWebMajordomo(router *jsonrpc2.Router, wrap shared.TincWebMajordomo) []string {
	router.RegisterFunc("TincWebMajordomo.Join", func(params json.RawMessage, positional bool) (interface{}, error) {
		var args struct {
			Arg0 string        `json:"network"`
			Arg1 *network.Node `json:"self"`
		}
		var err error
		if positional {
			err = jsonrpc2.UnmarshalArray(params, &args.Arg0, &args.Arg1)
		} else {
			err = json.Unmarshal(params, &args)
		}
		if err != nil {
			return nil, err
		}
		return wrap.Join(args.Arg0, args.Arg1)
	})

	return []string{"TincWebMajordomo.Join"}
}