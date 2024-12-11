var path = require('path')
var fs = require("fs")
var express = require('express')
const multer = require('multer');
const upload = multer();
var exphbs = require('express-handlebars')
var ImageKit = require("imagekit");

var app = express()
var port = process.env.SERVER_PORT || 3000

var db_host = "http://localhost:10662"


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.static('../static'))

var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_ENDPOINT
});


app.get('/', async function (req, res, next) {
    const recipe_request = await fetch(
        `${db_host}/recipes`
    )
    if (recipe_request.status === 200) {
        const recipes = await recipe_request.json()
        console.log(recipes)
        res.status(200).render('recipesPage', {
            renderAll: true,
            recipes: recipes
        })
    }
})

app.get('/recipes/:id', async function (req, res, next) {
    const recipe_id = req.params.id
    const recipe_request = await fetch(
        `${db_host}/recipes/${recipe_id}`
    )
    if (recipe_request.status === 200) {
        const recipe = await recipe_request.json()
        console.log("=== SINGLE RECIPE")
        console.log(recipe)
        res.status(200).render('singleRecipePage', recipe)
    }
})

function hasNullOrEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (
                value === null ||
                value === undefined ||
                (typeof value === 'string' && value.trim() === '') ||
                (Array.isArray(value) && value.length === 0) ||
                (typeof value === 'object' && Object.keys(value).length === 0)
            ) {
                return true;
            }
        }
    }
    return false;
}

function uploadFile(req, res) {
    if (req.file) {
        imagekit.upload({
            file: req.file,
            fileName: req.filename,
            folder: 'user_avatars'
        }, function (err, response) {
            if (err) {
                return res.status(500).json({
                    status: "failed",
                    message: "An error occured during file upload. Please try again."
                })
            }

            res.json({ status: "success", message: "Successfully uploaded files" });
        })
    }
}

app.post('/recipes', upload.single("image"), async function (req, res, next) {
    console.log("=== POST")
    console.log(req.body)
    try {
        const recipe_data = req.body;
        const post_response = await fetch(`${db_host}/recipes`,
            {
                method: "POST",
                body: JSON.stringify(recipe_data),
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
        let post_response_json = await post_response.json()
        if (post_response.status === 201) {
            console.log("=== POST: Recipe created. Uploading image")
            let folder = post_response_json.recipe._id
            let filename = req.file.originalname.trim().replace(/\s+/g, '_')
            console.log(post_response_json)
            console.log(`${folder}/${filename}`)
            if (req.file) {
                console.log("=== POST: Image found")
                let imgkit_response = {default: "Default"}
                imgkit_response = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: filename,
                    folder: folder
                })/*.then(response => {
                    console.log(response);
                    imgkit_response = response
                }).catch(error => {
                    console.log(error);
                });*/
                console.log(imgkit_response)
                let put_body = {
                    "images": [imgkit_response.url]
                }
                console.log(`${db_host}/recipes/${folder}`)
                console.log(put_body)
                await fetch(`${db_host}/recipes/${folder}`, 
                    {
                        method: "PUT",
                        body: JSON.stringify(put_body),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
            }
        }
        res.status(post_response.status).json(post_response_json)
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error creating recipe', error: error.message });
    }
})

app.listen(port, function () {
    console.log("== Server is listening on port", port)
})
