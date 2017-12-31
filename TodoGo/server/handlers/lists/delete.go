package lists

import (
	"github.com/satori/go.uuid"
	"net/http"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
)

func Delete(c *gin.Context) {
	db := database.DB

	uid, err := uuid.FromString(c.Params.ByName("Id"))
	if err != nil {
		c.Writer.WriteHeader(http.StatusBadRequest)
	}

	go func() {
		_, err = db.Model(&domain.Todo{}).Where("list_id = ?", uid).Delete()
	}()

	var td domain.List
	_, err = db.Model(&td).Where("id = ?", uid).Delete()
	if err != nil {
		panic(err)
	}
}
