package socket

import (
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/gin-gonic/gin"
	"net/http"
	"encoding/json"
	"github.com/op/go-logging"
)

var log = logging.MustGetLogger("todos/socket")

var wsUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleSocket(c *gin.Context) {
	ws, err := wsUpgrader.Upgrade(c.Writer, c.Request, nil)

	if err != nil {
		fmt.Println("Failed to set websocket upgrade: %+v", err)
		return
	}

	conn := &Connection{
		send: make(chan json.Marshaler, 256),
		ws:   ws,
	}

	Hub.Register <- conn
	log.Info("Connection upgraded.")

	go conn.writePump()
	conn.readPump()

	log.Info("Connection closed")
}