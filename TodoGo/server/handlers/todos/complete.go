package todos

import (
	"encoding/json"
	"net/http"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
	"time"
	"todos/TodoGo/utils"
	"github.com/go-pg/pg"
)

func Complete(c *gin.Context) {
	db := database.DB

	req := domain.TodoCompleteRequest{}
	bytes, _ := utils.Reader(c)

	err := json.Unmarshal(bytes, &req)
	if err != nil {
		c.Writer.WriteHeader(http.StatusBadRequest)
		return
	}

	var td domain.Todo
	err = db.Model(&td).Where("id = ?", req.TodoId).First()
	if err != nil {
		panic(err)
	}

	td.Completed = req.Completed
	if req.Completed {
		td.CompletedAt.Time = time.Now()
	} else {
		td.CompletedAt = pg.NullTime{}
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