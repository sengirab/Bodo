package todos

import (
	"github.com/satori/go.uuid"
	"net/http"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
)

func DecideDeleteAction(c *gin.Context) {
	db := database.DB

	uid, err := uuid.FromString(c.Params.ByName("Id"))
	if err != nil {
		c.Writer.WriteHeader(http.StatusBadRequest)
	}

	var td domain.Todo
	err = db.Model(&td).Where("id = ?", uid).First()
	if err != nil {
		panic(err)
	}

	if !td.DeletedAt.IsZero() || td.ParentId.Valid {
		deleteHard(c, td)
	} else {
		deleteSoft(c, td)
	}
}

func deleteSoft(c *gin.Context, td domain.Todo) {
	db := database.DB

	td.SoftDelete()
	_, err := db.Model(&td).Update()
	if err != nil {
		panic(err)
	}

	jsn, _ := json.Marshal(td)

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(jsn)
}

func deleteHard(c *gin.Context, td domain.Todo) {
	db := database.DB

	_, err := db.Model(&td).Delete()
	if err != nil {
		panic(err)
	}

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write([]byte("null"))
}
