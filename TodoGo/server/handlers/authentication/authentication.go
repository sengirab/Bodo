package authentication

import (
	"crypto/rsa"
	"io/ioutil"
	"github.com/dgrijalva/jwt-go"
	"github.com/satori/go.uuid"
	"github.com/gin-gonic/gin"
	"todos/TodoGo/utils"
	"time"
	"todos/TodoGo/domain"
)

type TokenResponse struct {
	Token string
}

type UserContext struct {
	Id    uuid.UUID
	Email string
}

func GetContext(c *gin.Context) *UserContext {
	ru, _ := c.Get("usr")

	return ru.(*UserContext)
}

// Not for production.
const (
	privateKeyPath = "app.rsa"
	publicKeyPath  = "app.rsa.pub"
)

var (
	VerifyKey *rsa.PublicKey
	SignKey   *rsa.PrivateKey
)

func InitKeys() {
	signBytes, err := ioutil.ReadFile(privateKeyPath)
	utils.Fatal(err)

	SignKey, err = jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	utils.Fatal(err)

	verifyBytes, err := ioutil.ReadFile(publicKeyPath)
	utils.Fatal(err)

	VerifyKey, err = jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
	utils.Fatal(err)
}

func CreateTokenAndClaim(user *domain.User) *jwt.Token {
	token := jwt.New(jwt.SigningMethodRS256)
	claims := make(jwt.MapClaims)

	claims["exp"] = time.Now().Add(time.Hour * time.Duration(24)).Unix()
	claims["iat"] = time.Now().Unix()

	// User context.
	claims["usrId"] = user.Id
	claims["usrEmail"] = user.Username

	token.Claims = claims

	return token
}
