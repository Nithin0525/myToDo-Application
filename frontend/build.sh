#!/bin/bash

echo "Starting build process..."
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

echo "Installing dependencies..."
npm install

echo "Building React app..."
npm run build

echo "Build complete!"
echo "Build directory contents:"
ls -la build/ 