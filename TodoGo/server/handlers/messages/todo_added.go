package messages

import (
	"encoding/json"
	"todos/TodoGo/domain"
)

const TodoAddedType = "TODO_ADDED"

type TodoAdded struct {
	Todo domain.Todo
}

func (ta TodoAdded) MarshalJSON() ([]byte, error) {
	type Alias TodoAdded

	return json.Marshal(&struct {
		Type   string `json:"Type"`
		Fields Alias  `json:"Fields"`
	}{
		Type: TodoAddedType,
		Fields: (Alias)(ta),
	})
}

func (ta TodoAdded) UnmarshalJSON(b []byte) Message {
	json.Unmarshal(b, &ta)
	return ta
}

func (ta TodoAdded) Handleable(c SocketConnection) bool {
	return true
}

func (ta TodoAdded) Handle(c SocketConnection) {
}