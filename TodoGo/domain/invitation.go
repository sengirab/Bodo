package domain

import "github.com/satori/go.uuid"

type Invitation struct {
	Id     uuid.UUID `sql:",pk,type:uuid default uuid_generate_v4()"`
	ListId uuid.UUID `sql:",type:uuid"`
	Email  string
}
