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
    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error
        const title = req.body.title
        const record = req.body.record;

        const posts = JSON.parse(data)
        var dpl_title = false
        var dpl_record = false
        if (posts.find(title_ => title_.title == title))
            dpl_title = true
        if (posts.find(title_ => title_.record == record))
            dpl_record = true

        if (title.trim() == '' && record.trim() == ''){
            res.render('create', { error1: true })
        } 
        else if (title.trim() == ''){
            res.render('create', { error2: true })
        }
        else if (record.trim() == ''){
            res.render('create', { error3: true })
        }
        else if (dpl_title == true){
            res.render('create', { error_duplicate_title: true })
        }
        else if (dpl_record == true){
            res.render('create', { error_duplicate_record: true })
        }
        else {
            fs.readFile('./data/posts.json', (error, data) => {
                if (error) throw error

                const posts = JSON.parse(data)

                posts.push({
                    archive_status: false,
                    id: id(),
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
})


app.get('/posts/:id/update', (req, res) => {
    var Id = req.params.id

    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error

        const posts = JSON.parse(data)
        const filteredPosts = posts.filter(post => post.id != Id)

        fs.writeFile('./data/posts.json', JSON.stringify(filteredPosts), (error) => {
            if (error) throw error

            res.render('update')
        })
    })
})

app.post('/update', (req, res) => {
    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error

        const posts = JSON.parse(data)

        const title =  req.body.title
        const record =  req.body.record

        if (title.trim() == '' && record.trim() == ''){
            res.render('update', { error1: true })
        } 
        else if (title.trim() == ''){
            res.render('update', { error2: true })
        }
        else if (record.trim() == ''){
            res.render('update', { error3: true })
        }
        else {
            fs.readFile('./data/posts.json', (error, data) => {
                if (error) throw error

                const posts = JSON.parse(data)

                posts.push({
                    archive_status: false,
                    id: id(),
                    title: title,
                    record: record,
                })

                fs.writeFile('./data/posts.json', JSON.stringify(posts), error => {
                    if (error) throw error

                    res.render('update', { success: true })
                })
            })
        }
    })
})

// all posts
app.get('/posts', (req, res) => {
    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error

        const posts = JSON.parse(data)
        const filteredPosts = posts.filter(post => post.archive_status == false)


        res.render('posts', { posts: filteredPosts, archive_status: false })
    })
})

// archived posts
app.get('/archive', (req, res) => {
    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error

        const posts = JSON.parse(data)
        const filteredPosts = posts.filter(post => post.archive_status == true)


        res.render('archive', { posts: filteredPosts, archive_status: true })
    })
})

// record in detail
app.get(`/posts/:id`, (req, res) => {
    const id = req.params.id

    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error

        const posts = JSON.parse(data)
        const post = posts.find(post => post.id == id)

        res.render('record', { post: post })
    })
})

// delete
app.get('/posts/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error

        const posts = JSON.parse(data)
        const filteredPosts = posts.filter(post => post.id != id)

        fs.writeFile('./data/posts.json', JSON.stringify(filteredPosts), (error) => {
            if (error) throw error

            res.redirect('/posts')
        })
    })
})

// archive
app.get('/posts/:id/archive', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error

        const posts = JSON.parse(data)
        const post = posts.find(post => post.id == id)

        let idx = posts.indexOf(post)

        posts[idx].archive_status = true 

        fs.writeFile('./data/posts.json', JSON.stringify(posts), (error) => {
            if (error) throw error
            res.redirect('/posts')
            // fs.readFile('./data/posts.json', (err, data) => {
            //     let filteredPosts = JSON.parse(data)
            //     res.render('posts', { posts: filteredPosts, archive_status: false})
            // })            
        })
    })
})

// unarchive
app.get('/posts/:id/unarchive', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/posts.json', (error, data) => {
        if (error) throw error

        const posts = JSON.parse(data)
        const post = posts.find(post => post.id == id)

        let idx = posts.indexOf(post)

        posts[idx].archive_status = false

        fs.writeFile('./data/posts.json', JSON.stringify(posts), (error) => {
            if (error) throw error
            res.redirect('/archive')
        })
    })
})

/*port 5000*/
app.listen(5000, err => {
    if (err) console.log(err)

    console.log('Server is running on port 5000')
})

function id() {
    return  "id" + Math.random().toString(16).slice(2);
}