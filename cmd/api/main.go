package main

import (
	"context"
	"github.com/TheLonger011/Nebula/internal/config"
	"github.com/TheLonger011/Nebula/internal/database"
	"log"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Error loading config: ", err)
	}
	log.Printf("Config: %+v", cfg)

	ctx := context.Background()
	conn, err := database.ConnectDB(ctx, &cfg.DB)
	if err != nil {
		log.Fatal("Error connecting to database: ", err)
	}
	log.Println("successfully connected to database")

	defer conn.Close()
}
