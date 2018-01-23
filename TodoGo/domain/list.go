package domain

import "github.com/satori/go.uuid"

type List struct {
	Model
	Name string

	TodoCount int         `sql:"-"`
	Todos     []*Todo     `json:"-"`
	Users     []uuid.UUID `pg:",array"`
	UserId    uuid.UUID   `sql:",type:uuid"`
}
