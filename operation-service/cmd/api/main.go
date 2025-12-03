package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"BudgetMate-go/database"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	db, err := database.Connect()
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}
	defer db.Close()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("Servidor en http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
