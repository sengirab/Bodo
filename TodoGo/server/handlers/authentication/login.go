package authentication

import (
	"io/ioutil"
	"encoding/json"
	"net/http"
	"golang.org/x/crypto/bcrypt"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"time"
	"todos/TodoGo/database"
	"todos/TodoGo/domain"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/utils"
)

func Login(c *gin.Context) {
	db := database.DB

	var credentials domain.Credentials
	var user domain.User

	bytes, _ := ioutil.ReadAll(c.Request.Body)
	err := json.Unmarshal(bytes, &credentials)

	if err != nil {
		panic(err)
		c.Writer.WriteHeader(http.StatusBadRequest)
		return
	}

	err = db.Model(&user).Where("username = ?", credentials.Username).First()

	fmt.Println(err)
	if err != nil {
		c.Writer.WriteHeader(http.StatusForbidden)
		fmt.Fprint(c.Writer, "Invalid credentials")
		return
	} else {
		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password))

		if err != nil {
			c.Writer.WriteHeader(http.StatusForbidden)
			fmt.Fprint(c.Writer, "Invalid credentials")
			return
		}
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

func CreateTokenAndClaim(user *domain.User) *jwt.Token {
	token := jwt.New(jwt.SigningMethodRS256)
	claims := make(jwt.MapClaims)

	claims["exp"] = time.Now().Add(time.Hour * time.Duration(24)).Unix()
	claims["iat"] = time.Now().Unix()

	// User context.
	claims["usrId"] = user.Id

	token.Claims = claims

	return token
}
