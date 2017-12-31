package todos

import (
	"todos/TodoGo/utils"
	"encoding/json"
	"net/http"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
)

func Patch(c *gin.Context) {
	db := database.DB

	td := domain.Todo{}
	bytes, _ := utils.Reader(c)

	err := json.Unmarshal(bytes, &td)
	if err != nil {
		c.Writer.WriteHeader(http.StatusBadRequest)
		return
	}

	_, err = db.Model(&td).Update()
	if err != nil {
		panic(err)
	}

	jsn, _ := json.Marshal(td)

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(jsn)
}