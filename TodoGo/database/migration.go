package database

import (
	"todos/TodoGo/domain"
	"github.com/go-pg/pg/orm"
)

func Migrate() error {
	db := Service()
	defer db.Close()

	for _, model := range []interface{}{
		// Models
		&domain.User{},
		&domain.List{},
		&domain.Todo{},
	} {
		err := db.CreateTable(model, &orm.CreateTableOptions{
			Temp:        false,
			IfNotExists: true,
		})

		if err != nil {
			return err
		}
	}

	return nil
}
