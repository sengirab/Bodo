package socket

import (
	"github.com/satori/go.uuid"
	"todos/TodoGo/server/handlers/messages"
)

type hub struct {
	connections map[*Connection]bool
	Register    chan *Connection
	Unregister  chan *Connection
}

var Hub = hub{
	Register:    make(chan *Connection),
	Unregister:  make(chan *Connection),
	connections: make(map[*Connection]bool),
}

func (h *hub) Run() {
	for {
		select {
		case c := <-h.Register:
			h.connections[c] = true
		case c := <-h.Unregister:
			if _, ok := h.connections[c]; ok {
				delete(h.connections, c)
			}
		}
	}
}

func SendComposedMessage(msg messages.Message, uuid map[uuid.UUID]string) {
	for k := range Hub.connections {
		if _, ok := uuid[k.Id]; ok {
			*k.Channel() <- msg
		}
	}
}
