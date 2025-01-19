# MyPurrquinox Store API

The **MyPurrquinox Store API** provides a set of endpoints to manage the products in the store and retrieve user details. This API handles everything automatically, including transactions and inventory management.

## Table of Contents

- [API Overview](#api-overview)
- [Endpoints](#endpoints)
  - [Products](#products)
  - [Users](#users)
- [Authentication](#authentication)
- [Response Format](#response-format)

---

## API Overview

The MyPurrquinox Store API allows you to interact with the product catalog and user data. It provides endpoints for managing products in the store and retrieving user details, including their purchase history and available credits.

## Endpoints

### Products

| Method | Endpoint          | Description               |  
|--------|-------------------|---------------------------|  
| GET    | `/products`       | Retrieve all products.    |  
| GET    | `/products/{id}`  | Retrieve a single product.|  
| POST   | `/products`       | Add a new product.        |  
| PUT    | `/products/{id}`  | Update product details.   |  
| DELETE | `/products/{id}`  | Remove a product.         |  

### Users

| Method | Endpoint          | Description                                                                 |  
|--------|-------------------|-----------------------------------------------------------------------------|  
| GET    | `/users/{id}`     | Retrieve user details, including their name, ID, credits, and items purchased. |  

---

## Authentication

The API uses **API keys** for authentication. Include your API key in the `Authorization` header of your requests:

```bash
Authorization: Bearer YOUR_API_KEY
```
---

Response Format:
All responses are JSON-encoded. A typical response includes:
- status: Indicates success (200) or failure (4xx/5xx).
- data: Contains the requested resource or an error message.


Example Success Response:
```javascript
{
  "status": 200,
  "data": {
    "id": "12345",
    "name": "Purrquinox Hoodie",
    "price": 29.99
  }
}
```

Example Error Response:
```javascript
{
  "status": 404,
  "error": "Product not found"
}
```
