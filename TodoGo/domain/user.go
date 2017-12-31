package domain

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
