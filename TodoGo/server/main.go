package server

import (
	"github.com/gin-gonic/gin"
	"todos/TodoGo/server/middlewares"
	"todos/TodoGo/server/handlers/lists"
	"todos/TodoGo/server/handlers/todos"
	"todos/TodoGo/server/handlers/authentication"
	"todos/TodoGo/server/handlers/socket"
)

func Run() {
	router := gin.Default()
	router.Use(middlewares.Cors)

	auth := router.Group("/authentication")
	{
		// Authentication
		auth.POST("/login", authentication.Login)
		auth.POST("/register", authentication.Register)
	}

	client := router.Group("/client").Use(middlewares.ValidateTokenMiddleware)
	{
		// Users
		client.GET("/user/validate", authentication.Validate)

		// Lists
		client.GET("/lists", lists.Get)
		client.GET("/lists/shared", lists.GetSharedLists)
		client.GET("/lists/users/:Id", lists.GetListUsers)

		client.POST("/lists", lists.Add)
		client.POST("/lists/invite", lists.InviteMembers)
		client.POST("/lists/accept", lists.AcceptInvitation)


		client.DELETE("/lists/:Id", lists.Delete)

		// Todos
		client.GET("/todos/:Id", todos.Get)
		client.DELETE("/todos/:Id", todos.DecideDeleteAction)
		client.POST("/todos/complete", todos.Complete)

		client.POST("/todos", todos.Add)
		client.PATCH("/todos", todos.Patch)
	}

	go socket.Hub.Run()
	router.GET("/ws", socket.HandleSocket)

	router.Run(":8080")
}
