#!/bin/bash

echo "🌱 Starting Database Seeding Process..."
echo "======================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found! Please create it first."
    exit 1
fi

# Run the seeder
echo "🔄 Running database seeder..."
node src/seeders/index.js

echo "======================================="
echo "✅ Database seeding completed!"
