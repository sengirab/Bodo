package messages

import (
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"todos/TodoGo/server/handlers/authentication"
	"todos/TodoGo/utils"
)

const IdentificationType = "IDENTIFY"

type IdentificationRequest struct {
	Provide string
}

func (em *IdentificationRequest) MarshalJSON() ([]byte, error) {
	type Alias IdentificationRequest

	return json.Marshal(&struct {
		Type   string `json:"Type"`
		Fields Alias  `json:"Fields"`
	}{
		Type: IdentificationType,
		Fields: (Alias)(*em),
	})
}

type Identification struct {
	Type   string
	Fields struct{
		Token string
	}
}

func (i Identification) MarshalJSON() ([]byte, error) {
	return json.Marshal(i)
}

func (i Identification) UnmarshalJSON(b []byte) Message {
	json.Unmarshal(b, &i)
	return i
}

func (i Identification) Handleable(c SocketConnection) bool {
	claims := jwt.MapClaims{}

	token, err := jwt.ParseWithClaims(i.Fields.Token, claims, func(token *jwt.Token) (interface{}, error) {
		return authentication.VerifyKey, nil
	})

	if err != nil {
		panic(err)
	}

	c.SetId(utils.UuidFromString(claims["usrId"].(string)))

	return token.Valid
}

func (i Identification) Handle(c SocketConnection) {
	*c.Channel() <- &Authorization{
		Status: true,
		Message: "Succesfully authorized",
	}
}