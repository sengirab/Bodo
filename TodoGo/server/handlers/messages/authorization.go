package messages

import "encoding/json"

const AuthorizationType = "AUTHORIZATION"

type Authorization struct {
	Status       bool
	Message      string `json:"Message,omitempty"`
}

func (em *Authorization) MarshalJSON() ([]byte, error) {
	type Alias Authorization

	return json.Marshal(&struct {
		Type   string `json:"Type"`
		Fields Alias  `json:"Fields"`
	}{
		Type: AuthorizationType,
		Fields: (Alias)(*em),
	})
}
