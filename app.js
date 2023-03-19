const express = require('express')
const app = express()

// file system module
const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

/* localhost:5000 */

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const record = req.body.record

    if (title.trim() == '' || record.trim() == ''){
        res.render('create', { error: true })
    } 
    else {
        fs.readFile('./data/posts.json', (error, data) => {
            if (error) throw error

            const posts = JSON.parse(data)

            posts.push({
                id: id (),
                title: title,
                record: record,
            })

            fs.writeFile('./data/posts.json', JSON.stringify(posts), error => {
                if (error) throw error

                res.render('create', { success: true })
            })
        })
    }
})

app.get('/posts', (req, res) => {
    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error

        const posts = JSON.parse(data)

        res.render('posts', {posts: posts })
    })
})

// :id for dynamic url
app.get('/posts/:id', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error

        const posts = JSON.parse(data)
        const post = posts.filter(post => post.id == id)[0]

        res.render('record', { post: post })
    })
})

/*port 5000*/
app.listen(5000, err => {
    if (err) console.log(err)

    console.log('Server is running on port 5000')
})

function id () {
    return  "id" + Math.random().toString(16).slice(2);
}