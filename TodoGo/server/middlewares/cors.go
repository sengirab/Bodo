package middlewares

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func Cors(c *gin.Context) {
	c.Writer.Header().Add("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Add("Access-Control-Allow-Headers", "Prefer, Content-Type, Accept, Authorization")
	c.Writer.Header().Add("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE, OPTIONS")

	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(http.StatusOK)
	}

	c.Next()
}
