package lists

import (
	"encoding/json"
	"net/http"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
	"github.com/satori/go.uuid"
)

func Get(c *gin.Context) {
	db := database.DB

	uid, err := uuid.FromString(c.Params.ByName("Id"))
	if err != nil {
		c.Writer.WriteHeader(http.StatusBadRequest)
	}

	var lts []domain.List

	err = db.Model(&lts).Where("user_id = ?", uid).Column("list.*").Select()
	CountListTodos(lts)

	if err != nil {
		panic(err)
	}

	jsn, _ := json.Marshal(lts)

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(jsn)
}

func CountListTodos(lists []domain.List) {
	db := database.DB

	var res domain.TodoCountResult

	err := db.Model(&domain.Todo{}).Column("todo.list_id").
		Where("todo.parent_id IS NULL AND todo.deleted_at IS NULL AND todo.completed_at IS NULL").
		ColumnExpr("count(*) AS todo_count").
		Group("todo.list_id").
		Select(&res)

	if err != nil {
		panic(err)
	}

	m := res.ToMap()

	for i := range lists {

		if count, ok := m[lists[i].Id]; ok {
			lists[i].TodoCount = count
		}
	}
}