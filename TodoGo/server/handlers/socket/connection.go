package socket

import (
	"time"
	"encoding/json"
	"github.com/satori/go.uuid"
	"bytes"
	"github.com/gorilla/websocket"
	"todos/TodoGo/server/handlers/messages"
	"fmt"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = 1 * time.Second

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

type Connection struct {
	ws   *websocket.Conn
	send chan json.Marshaler
	Id   uuid.UUID
}

func (c *Connection) Channel() *chan json.Marshaler {
	return &c.send
}

func (c *Connection) SetId(uuid uuid.UUID) {
	c.Id = uuid
}

// write writes a message with the given message type and payload.
func (c *Connection) write(mt int, payload []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.ws.WriteMessage(mt, payload)
}

// writePump pumps messages from the hub to the websocket connection.
func (c *Connection) writePump() {
	ticker := time.NewTicker(pingPeriod)

	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				return
			}

			buff := new(bytes.Buffer)
			if err := json.NewEncoder(buff).Encode(message); err != nil {
				log.Error(err.Error())
				return
			} else if err := c.write(websocket.TextMessage, buff.Bytes()); err != nil {
				log.Error(err.Error())
				return
			}
		case <-ticker.C:
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				log.Errorf("%#v", err.Error())
				return
			}
		}
	}
}

func (c *Connection) readPump() {
	defer func() {
		Hub.Unregister <- c
		c.ws.Close()
	}()

	c.ws.SetReadLimit(maxMessageSize)
	c.ws.SetReadDeadline(time.Now().Add(pongWait))
	c.ws.SetPongHandler(func(string) error {
		c.ws.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	*c.Channel() <- &messages.IdentificationRequest{
		Provide: "token",
	}

	for {
		_, message, err := c.ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Info(fmt.Sprintf("error: %v", err))
			}
			break
		}

		var v map[string]interface{}
		if err := json.NewDecoder(
			bytes.NewBuffer(message)).Decode(&v); err != nil {
			log.Error("Error decoding message: ", err.Error())
			continue
		}

		t := v["Type"].(string)
		success := messages.HandleMessage(c, t, message)
		if !success {
			break
		}
	}
}