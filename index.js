const express = require('express');
const request = require('request');
const bodyParser = require("body-parser");
const logger = require('morgan')
const methodOverride = require("method-override");
const app = express()


app.use(logger('dev'))
app.use(methodOverride("_method"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


let url = `https://clubfreetst.herokuapp.com/blogs/`
let blog = {
    siteId: '',
    blogger: '',
    title: '',
    notes: []
}
let errors = []

app.delete('/', (req, res, next) => {
    let id_deleted = req.body.id
    let urld = url + id_deleted

    request(urld, (error, response, body) => {
        if (id_deleted.length != 7) {
            res.send("The note's ID is wrong");
        }
        else {
            console.log('statusCode:', response.statusCode);
            notes__json = JSON.parse(body);

            res.render("./index.ejs", {
                blog: blog,
                errors: errors
            });
        }


    })
})


app.post('/', (req, res) => {
    let blogID = req.body.blogID
    let urlp = url + blogID
    let errors = []
    if (!blogID || blogID.length < 5 || blogID.length > 7) {
        errors.push({ error: 'Please add a correct BlogID' })
        res.render("./index.ejs", {
            blog: blog,
            errors: errors
        });
    }

    request(urlp, (error, response, body) => {
        notes__json = JSON.parse(body);
        if (notes__json.err === 'blogID not found') {
            res.send(notes__json.err);
        }
        var blog = {
            siteId: blogID,
            blogger: notes__json.blogger,
            title: notes__json.title,
            notes: notes__json.notes
        }
        res.render("./index.ejs", {
            blog: blog,
            errors: errors
        });

    })

})

app.get('/', (req, res) => {
    res.render("./index.ejs", {
        blog: blog,
        errors: errors
    });

})


const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})