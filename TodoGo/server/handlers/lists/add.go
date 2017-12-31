package lists

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

	list := domain.List{}
	bytes, _ := ioutil.ReadAll(c.Request.Body)

	err := json.Unmarshal(bytes, &list)
	if err != nil {
		c.Writer.WriteHeader(http.StatusBadRequest)
	}

	db.Insert(&list)

	jsn, _ := json.Marshal(list)

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(jsn)
}
