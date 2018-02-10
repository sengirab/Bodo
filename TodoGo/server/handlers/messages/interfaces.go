package messages

import (
	"encoding/json"
	"github.com/satori/go.uuid"
)

type Message interface {
	SendMessage
	ReceiveMessage
}

type SendMessage interface {
	json.Marshaler
}

type ReceiveMessage interface {
	Handle(c SocketConnection)
	Handleable(c SocketConnection) bool
	UnmarshalJSON(b []byte) Message
}

type MessageHandlers map[string]Message

var Handlers = MessageHandlers{
	IdentificationType: Identification{},
	TodoAddedType: TodoAdded{},
}

type SocketConnection interface {
	Channel() *chan json.Marshaler
	SetId(uuid uuid.UUID)
}
