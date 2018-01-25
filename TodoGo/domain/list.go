package domain

import (
	"github.com/satori/go.uuid"
	"github.com/go-pg/pg/orm"
	"time"
)

type List struct {
	Model
	Name string

	TodoCount int         `sql:"-"`
	Todos     []*Todo     `json:"-"`
	Users     []uuid.UUID `pg:",array"`
	UserId    uuid.UUID   `sql:",type:uuid"`
}

func (l *List) BeforeInsert(db orm.DB) error {
	if l.CreatedAt.IsZero() {
		l.CreatedAt = time.Now()
	}

	return nil
}