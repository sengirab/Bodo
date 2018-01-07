package main

import (
	"todos/TodoGo/server"
	"todos/TodoGo/database"
	"github.com/go-pg/pg"
	"log"
	"todos/TodoGo/server/handlers/authentication"
)

func init() {
	authentication.InitKeys()
	pg.SetLogger(&log.Logger{})

	err := database.Migrate()
	if err != nil {
		panic(err)
	}

	database.Connect()
}

func main() {
	server.Run()
}