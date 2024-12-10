
# API Reference

## /recipes

### GET /recipes

Get all recipes present in the database. Example response:
```
[
    {
        "_id": "6746341e9a699f533aa7cd32",
        "title": "Spaghetti Carbonara",
        "description": "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
        "ingredients": [
            "200g spaghetti",
            "100g pancetta",
            "2 large eggs",
            "50g grated Parmesan",
            "Black pepper",
            "Salt"
        ],
        "instructions": [
            "Cook spaghetti in salted water until al dente.",
            "Fry pancetta until crispy.",
            "Whisk eggs with Parmesan and a pinch of black pepper.",
            "Drain pasta and mix quickly with pancetta and egg mixture.",
            "Serve with extra Parmesan and black pepper."
        ],
        "images": [
            "https://example.com/spaghetti-carbonara.jpg"
        ],
        "categoryTags": [
            "Italian",
            "Pasta",
            "Quick"
        ],
        "preparationTime": 25,
        "difficulty": "Medium",
        "createdAt": "2024-11-26T20:48:30.853Z",
        "updatedAt": "2024-11-26T20:48:30.853Z",
        "__v": 0
    },
    {
        "_id": "6746341e9a699f533aa7cd33",
        "title": "Vegan Buddha Bowl",
        "description": "A nourishing bowl filled with roasted veggies, quinoa, and tahini dressing.",
        "ingredients": [
            "1 cup quinoa",
            "1 sweet potato",
            "1 cup chickpeas",
            "1 cup spinach",
            "2 tbsp tahini",
            "1 lemon"
        ],
        "instructions": [
            "Cook quinoa according to package instructions.",
            "Roast diced sweet potato and chickpeas at 200°C for 20 minutes.",
            "Assemble quinoa, roasted veggies, and spinach in a bowl.",
            "Drizzle with tahini and squeeze lemon juice over the top."
        ],
        "images": [
            "https://example.com/vegan-buddha-bowl.jpg"
        ],
        "categoryTags": [
            "Vegan",
            "Healthy",
            "Quick"
        ],
        "preparationTime": 30,
        "difficulty": "Easy",
        "createdAt": "2024-11-26T20:48:30.853Z",
        "updatedAt": "2024-11-26T20:48:30.853Z",
        "__v": 0
    },
    {
        "_id": "6746341e9a699f533aa7cd34",
        "title": "Chocolate Chip Cookies",
        "description": "Classic chewy cookies with gooey chocolate chips.",
        "ingredients": [
            "1 cup butter",
            "1 cup sugar",
            "2 cups flour",
            "1 tsp baking soda",
            "1 cup chocolate chips",
            "1 egg"
        ],
        "instructions": [
            "Preheat oven to 180°C.",
            "Cream butter and sugar together.",
            "Mix in egg, then flour and baking soda.",
            "Fold in chocolate chips.",
            "Scoop dough onto baking tray and bake for 12-15 minutes."
        ],
        "images": [
            "https://example.com/chocolate-chip-cookies.jpg"
        ],
        "categoryTags": [
            "Dessert",
            "Snack",
            "Easy"
        ],
        "preparationTime": 20,
        "difficulty": "Easy",
        "createdAt": "2024-11-26T20:48:30.853Z",
        "updatedAt": "2024-11-26T20:48:30.853Z",
        "__v": 0
    }
]
```

### POST /recipes
Adds a recipe to the database. The following fields are required: 
- title
- description
- ingredients
- instructions
- preparationTime

Example request body:
```
{
    "title": "Spaghetti Carbonara",
    "description": "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
    "ingredients": ["200g spaghetti", "100g pancetta", "2 large eggs", "50g grated Parmesan", "Black pepper", "Salt"],
    "instructions": [
        "Cook spaghetti in salted water until al dente.",
        "Fry pancetta until crispy.",
        "Whisk eggs with Parmesan and a pinch of black pepper.",
        "Drain pasta and mix quickly with pancetta and egg mixture.",
        "Serve with extra Parmesan and black pepper."
    ],
    "images": ["https://example.com/spaghetti-carbonara.jpg"],
    "categoryTags": ["Italian", "Pasta", "Quick"],
    "preparationTime": 25,
    "difficulty": "Medium"
}
```

### PUT /recipes/:id
Edit a recipe in the database. The id parameter is required. The body format is the same as the POST request

Example request. The ingredients of the Spaghetti Carbonara has been changed from 100g to 600g of spaghetti:
```
PUT <HOST>/recipes/6743af2e109a72c063a2e6b7
{
    "title": "Spaghetti Carbonara",
    "description": "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
    "ingredients": ["600g spaghetti", "100g pancetta", "2 large eggs", "50g grated Parmesan", "Black pepper", "Salt"],
    "instructions": [
        "Cook spaghetti in salted water until al dente.",
        "Fry pancetta until crispy.",
        "Whisk eggs with Parmesan and a pinch of black pepper.",
        "Drain pasta and mix quickly with pancetta and egg mixture.",
        "Serve with extra Parmesan and black pepper."
    ],
    "images": ["https://example.com/spaghetti-carbonara.jpg"],
    "categoryTags": ["Italian", "Pasta", "Quick"],
    "preparationTime": 25,
    "difficulty": "Medium"
}
```

## /users

### POST /users/register

Adds a user to the database. The following fields are required:
- username
- password
- email

Responses:
- 200 OK
- 400 Bad request if fields are invalid

Example request body
```
{
    "username": "Peasant",
    "password": "soup",
    "email": "example2@example.com"
}
```

### POST /users/login
Logins a user. The body is the same as user registration. The response will be a 1-hour authorization token for that user if login is successful. The API will return 401 if user not found or password doesn't match

Responses:
- 200 OK
- 401 Unauthorized if user not found or password doesn't match

Example response:
```
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDY1NWRiY2YwZGJhMmI4ZjM0Y2FjNSIsInVzZXJuYW1lIjoiQWRtaW4iLCJpYXQiOjE3MzM4MDQyNDcsImV4cCI6MTczMzgwNzg0N30.vdKCH7qIvjBi6w4fZpTS8v0vpHLbJ7h1afccRPXgGqY"
}
```
### GET /users/profile

Get a user's profile. Requires a bearer token in the authorization header.

Example request:
```javascript
fetch(apiUrl, {
                method: 'GET', // HTTP method
                headers: {
                    'Authorization': `Bearer ${token}`, // Authorization header with Bearer token
                    'Content-Type': 'application/json',
                },
            })
```

Example response:
```
{
    "user": {
        "id": "674655dbcf0dba2b8f34cac5",
        "username": "Admin",
        "email": "gouda@example.com",
        "favorites": [
            "Cheesecake"
        ]
    }
}
```