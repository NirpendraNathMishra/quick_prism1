# Quick_Prism
This project serves as an assessment for Quickprism, involving the creation of a backend system that manages inventory and sales for a small retail outlet. The system is constructed using Node.js and Express.js, with MongoDB employed for data storage purposes.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)

## Installation

Follow these steps to install the project:

1. **Clone the repository**: Run `git clone https://github.com/NirpendraNathMishra/quick_prism1.git` to clone the repository to your local machine.

2. **Install dependencies**: Navigate to the project directory and run `npm install` to install the necessary dependencies.

3. **Start the server**: Run `npm start` to start the server.

## Usage

Use Postman to check the all the api's and its feature

## API Reference

# Default

- **GET** http://localhost:3000/
  - This route sends a welcome message to the user.

## User Authentication

- **POST** http://localhost:3000/users/signup
  - This route signs up a new user. It requires a username and password in the request body.
- **POST** http://localhost:3000/users/login
  - This route logs in a user. It requires a username and password in the request body.

## Inventory Management

- **GET** http://localhost:3000/inventory
  - This route fetches all the items in the inventory.
- **POST** http://localhost:3000/inventory
  - This route creates a new item or updates an existing item in the inventory.
- **GET** http://localhost:3000/inventory/:name
  - This route fetches an item with a specific name from the inventory.
- **PUT** http://localhost:3000/inventory/:name
  - This route updates an item with a specific name in the inventory.
- **DELETE** http://localhost:3000/inventory/:name
  - This route deletes an item with a specific name from the inventory.

## Bill Management

- **GET** http://localhost:3000/bills
  - This route fetches all the bills.
- **POST** http://localhost:3000/bills
  - This route creates a new bill.
- **GET** http://localhost:3000/bills/:clientName
  - This route fetches all the bills for a specific client.
- **PUT** http://localhost:3000/bills/:billId
  - This route updates a specific bill.
- **DELETE** http://localhost:3000/bills/:billId
  - This route deletes a specific bill.


