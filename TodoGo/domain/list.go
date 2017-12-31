package domain

import "github.com/satori/go.uuid"

type List struct {
	Model
	Name      string

	TodoCount int       `sql:"-"`
	Todos     []*Todo   `json:"-"`
	UserId    uuid.UUID `sql:",type:uuid"`
}
