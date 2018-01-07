package authentication

import (
	"github.com/gin-gonic/gin"
	"encoding/json"
	"net/http"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
)

func Validate(c *gin.Context) {
	db := database.DB

	ctx := GetContext(c)

	var user domain.User

	err := db.Model(&user).Where("id = ?", ctx.Id).First()

	if err != nil {
		panic(err)
	}

	jsn, _ := json.Marshal(user)

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(jsn)
}
