package middlewares

import (
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/dgrijalva/jwt-go/request"
	"todos/TodoGo/server/handlers/authentication"
	"todos/TodoGo/utils"
)

func ValidateTokenMiddleware(c *gin.Context) {
	claims := jwt.MapClaims{}

	token, err := request.ParseFromRequestWithClaims(c.Request, request.AuthorizationHeaderExtractor, claims,
		func(token *jwt.Token) (interface{}, error) {
			return authentication.VerifyKey, nil
		})

	if err == nil {
		if token.Valid {

			ctx := authentication.UserContext{
				Id: utils.UuidFromString(claims["usrId"].(string)),
				Email: claims["usrEmail"].(string),
			}

			c.Set("usr", &ctx)
			c.Next()
		} else {
			c.Writer.WriteHeader(http.StatusUnauthorized)
			fmt.Fprint(c.Writer, "Token is not valid")
			c.AbortWithStatus(http.StatusUnauthorized)
		}
	} else {
		c.Writer.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(c.Writer, "No token in header")
		c.AbortWithStatus(http.StatusUnauthorized)

		return
	}
}
