package utils

import (
	"github.com/satori/go.uuid"
	"log"
)

func UuidFromString(string string) uuid.UUID {
	u, err := uuid.FromString(string)

	if err != nil {
		log.Fatal(err)
	}

	return u
}

func UuidSliceToStringSlice(slice []uuid.UUID) []string {
	var stringSlice []string

	for _, v := range slice {
		stringSlice = append(stringSlice, v.String())
	}

	return stringSlice
}