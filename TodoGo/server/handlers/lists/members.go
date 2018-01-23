package lists

import (
	"gopkg.in/gomail.v2"
	"log"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"encoding/json"
	"net/http"
	"github.com/satori/go.uuid"
	"todos/TodoGo/domain"
	"todos/TodoGo/database"
	"todos/TodoGo/server/handlers/authentication"
	"fmt"
)

type AddMembersRequest struct {
	Email  string
	ListId uuid.UUID
}

type AcceptMembersRequest struct {
	ListId uuid.UUID
}

func InviteMembers(c *gin.Context) {
	db := database.DB

	var list []AddMembersRequest
	bytes, _ := ioutil.ReadAll(c.Request.Body)

	err := json.Unmarshal(bytes, &list)
	if err != nil {
		c.Writer.WriteHeader(http.StatusBadRequest)
	}

	go func() {
		d := gomail.NewDialer("smtp.gmail.com", 465, "benjamin@codebridge.nl", "431432ben")

		s, err := d.Dial()
		if err != nil {
			panic(err)
		}

		m := gomail.NewMessage()
		for _, r := range list {
			// Insert email with corresponding listId that he is invited in
			// We're able to check if the user accepting the invitation is invited in to that list.
			invitation := domain.Invitation{Email: r.Email, ListId: r.ListId}
			db.Insert(&invitation)

			m.SetHeader("From", "no-reply@bodo.com")
			m.SetAddressHeader("To", r.Email, "")
			m.SetHeader("Subject", "Bodo, invited to share")
			m.SetBody("text/html", fmt.Sprintf("You have been invited to share a list <a href='http://localhost:4203/authentication/login?list=%v'>here</a>", r.ListId))

			if err := gomail.Send(s, m); err != nil {
				log.Printf("Could not send email to %q: %v", r.Email, err)
			}

			m.Reset()
		}
	}()

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusNoContent)
}

func AcceptInvitation(c *gin.Context) {
	db := database.DB
	ctx := authentication.GetContext(c)

	var listId AcceptMembersRequest
	bytes, _ := ioutil.ReadAll(c.Request.Body)

	err := json.Unmarshal(bytes, &listId)
	if err != nil {
		panic(err)
		c.Writer.WriteHeader(http.StatusBadRequest)
		return
	}

	var invitations []domain.Invitation
	err = db.Model(&invitations).Where("email = ?", ctx.Email).Select()

	if err != nil {
		panic(err)
	}

	// Check if user has been invited
	if !IsInvited(invitations, listId.ListId) {
		c.Writer.WriteHeader(http.StatusBadRequest)
		return
	}

	var list domain.List
	err = db.Model(&list).Where("id = ?", listId.ListId).Select()

	// Append new user to current user array on the list.
	users := append(list.Users, ctx.Id)
	list.Users = users

	// User added to list of users, update.
	err = db.Update(&list)

	// Deleting invitation, user has been added to users on the list.
	_, err = db.Model(&invitations).Where("email = ?", ctx.Email).Delete()

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusNoContent)
}

func IsInvited(invitations []domain.Invitation, listId uuid.UUID) bool {
	var isInvited bool

	for _, inv := range invitations {
		if inv.ListId == listId {
			isInvited = true
		}
	}

	return isInvited
}
