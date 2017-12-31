package server

import (
	"github.com/gin-gonic/gin"
	"todos/TodoGo/server/middlewares"
	"todos/TodoGo/server/handlers/lists"
	"todos/TodoGo/server/handlers/todos"
)

func Run() {
	router := gin.Default()
	router.Use(middlewares.Cors)


	//.Use(stack.ValidateTokenMiddleware)
	client := router.Group("/v1")
	{
		// Users

		// Lists
		client.GET("/lists/:Id", lists.Get)
		client.POST("/lists", lists.Add)
		client.DELETE("/lists/:Id", lists.Delete)


		// Todos
		client.GET("/todos/:Id", todos.Get)
		client.DELETE("/todos/:Id", todos.DecideDeleteAction)
		client.POST("/todos/complete", todos.Complete)

		client.POST("/todos", todos.Add)
		client.PATCH("/todos", todos.Patch)
	}

	router.Run(":8080")
}
