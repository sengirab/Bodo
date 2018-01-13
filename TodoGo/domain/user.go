package domain

import (
	"github.com/go-pg/pg/orm"
)

type User struct {
	Model
	FirstName string
	LastName  string
	Username  string
	Street    string
	Postal    string
	Password  string  `json:"-"`

	Lists     []*List `json:"-"`
}

type Credentials struct {
	Username string
	Password string
}

func (u *User) AfterInsert(db orm.DB) error {

	// Giving the user its initial list.
	list := List{Name:"Inbox", UserId: u.Id}
	db.Insert(&list)

	return nil
}