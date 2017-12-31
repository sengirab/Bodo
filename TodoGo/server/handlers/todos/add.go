package todos

import (
	"io/ioutil"
	"encoding/json"
	"net/http"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
)

func Add(c *gin.Context) {
	db := database.DB

	todo := domain.Todo{}
	bytes, _ := ioutil.ReadAll(c.Request.Body)

	err := json.Unmarshal(bytes, &todo)
	if err != nil {
		c.Writer.WriteHeader(http.StatusBadRequest)
	}

	err = db.Insert(&todo)
	if err != nil {
		panic(err)
	}

	jsn, _ := json.Marshal(todo)

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(jsn)
}
