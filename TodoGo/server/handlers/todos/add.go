package todos

import (
	"io/ioutil"
	"encoding/json"
	"net/http"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
	"todos/TodoGo/server/handlers/socket"
	"todos/TodoGo/server/handlers/messages"
	"github.com/satori/go.uuid"
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

	go notifyListUsers(todo)

	jsn, _ := json.Marshal(todo)

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(jsn)
}

func notifyListUsers(todo domain.Todo) {
	db := database.DB

	var lt domain.List
	db.Model(&lt).Where("id = ?", todo.ListId).Column("list.*").First()

	if len(lt.Users) <= 0 {
		return
	}

	var umap = make(map[uuid.UUID]string)

	// Add list owner to get the message.
	umap[lt.UserId] = ""

	// Adding all users in that list.
	for _, v := range lt.Users {
		umap[v] = ""
	}

	msg := messages.TodoAdded{Todo: todo}
	socket.SendComposedMessage(msg, umap)
}
