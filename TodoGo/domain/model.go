package domain

import (
	"github.com/satori/go.uuid"
	"time"
	"github.com/go-pg/pg"
)

type Model struct {
	Id        uuid.UUID `sql:",pk,type:uuid default uuid_generate_v4()"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt pg.NullTime
}
