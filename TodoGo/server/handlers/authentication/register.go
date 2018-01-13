package authentication

import (
	"io/ioutil"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
	"net/http"
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"todos/TodoGo/utils"
)

func Register(c *gin.Context) {
	db := database.DB

	var user domain.User

	bytes, _ := ioutil.ReadAll(c.Request.Body)
	err := json.Unmarshal(bytes, &user)

	err = db.Model(&user).Where("username = ?", user.Username).First()

	if err == nil {
		c.Writer.WriteHeader(http.StatusForbidden)
		fmt.Fprint(c.Writer, "Email is already registered")
		return
	}

	p, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(p)

	err = db.Insert(&user)

	if err != nil {
		c.Writer.WriteHeader(http.StatusBadRequest)
		return
	}

	token := CreateTokenAndClaim(&user)

	if err != nil {
		c.Writer.WriteHeader(http.StatusInternalServerError)
		utils.Fatal(err)
	}

	tokenString, err := token.SignedString(SignKey)

	if err != nil {
		c.Writer.WriteHeader(http.StatusInternalServerError)
		utils.Fatal(err)
	}

	response := TokenResponse{
		Token: tokenString,
	}
	jsn, _ := json.Marshal(response)

	c.Writer.Header().Add("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(jsn)
}
