package database

import (
	"github.com/go-pg/pg"
)

var DB *pg.DB

func Connect() {
	DB = Service()
}

func Service() *pg.DB {
	db := pg.Connect(&pg.Options{
		User: "benjamin",
		Database: "todos",
	})

	return db
}
