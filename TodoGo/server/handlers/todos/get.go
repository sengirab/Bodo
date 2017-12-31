package todos

import (
	"github.com/satori/go.uuid"
	"net/http"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
)

func Get(c *gin.Context) {
	db := database.DB

	uid, err := uuid.FromString(c.Params.ByName("Id"))
	if err != nil {
		c.Writer.WriteHeader(http.StatusBadRequest)
	}

	var tds []domain.Todo

	err = db.Model(&tds).Where("list_id = ? AND parent_id IS NULL", uid).
		Column("todo.*", "Todos").
		Order("todo.created_at DESC").
		Select()

	if err != nil {
		panic(err)
	}

	jsn, _ := json.Marshal(tds)

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(jsn)
}
