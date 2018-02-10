package messages

func HandleMessage(c SocketConnection, t string, b []byte) bool {
	h := GetHandler(t).UnmarshalJSON(b)

	if h.Handleable(c) {
		go h.Handle(c)
		return true
	}

	return false
}

func GetHandler(t string) ReceiveMessage {
	h := Handlers[t]
	return h
}