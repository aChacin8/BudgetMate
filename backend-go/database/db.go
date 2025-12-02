package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
)

func Connect() (*sql.DB, error) {
	driver := os.Getenv("DB_DRIVER")
	dsn := os.Getenv("DB_DSN")

	if driver == "" {
		return nil, fmt.Errorf("DB_DRIVER is not defined")
	}

	db, err := sql.Open(driver, dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Data Base connected successfully, driver:", driver)
	return db, nil
}
