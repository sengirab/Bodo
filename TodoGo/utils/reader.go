package utils

import (
	"io/ioutil"
	"github.com/gin-gonic/gin"
)

func Reader(c *gin.Context) ([]byte, error) {
	defer c.Request.Body.Close()

	return ioutil.ReadAll(c.Request.Body)
}
