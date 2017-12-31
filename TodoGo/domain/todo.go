package domain

import (
	"time"
	"github.com/satori/go.uuid"
	"github.com/go-pg/pg/orm"
	"github.com/go-pg/pg"
	"fmt"
)

type TodoCountResult []struct {
	ListId    uuid.UUID
	TodoCount int
}

func (r TodoCountResult) ToMap() map[uuid.UUID]int {
	m := make(map[uuid.UUID]int)

	for _, v := range r {
		m[v.ListId] = v.TodoCount
	}

	return m
}

type TodoCompleteRequest struct {
	TodoId    uuid.UUID
	Completed bool
}

type Todo struct {
	Model
	Text        string
	Completed   bool
	CompletedAt pg.NullTime

	Todos       []Todo        `pg:",fk:Parent"`
	ParentId    uuid.NullUUID `sql:",type:uuid"`
	ListId      uuid.UUID     `sql:",type:uuid"`
}

func (t *Todo) BeforeInsert(db orm.DB) error {
	t.Completed = false
	if t.CreatedAt.IsZero() {
		t.CreatedAt = time.Now()
	}

	if t.UpdatedAt.IsZero() {
		t.UpdatedAt = time.Now()
	}

	fmt.Println(t.ParentId)

	return nil
}

func (t *Todo) SoftDelete() {
	t.DeletedAt.Time = time.Now()
}
