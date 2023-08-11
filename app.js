const path=require('path');
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const Item = require('./models/item');

const app = express();
const PORT = process.env.PORT || 3000;



app.set('view engine', 'ejs');
// app.use(express.static('public'));
app.use(bodyParser.json());

//form:
app.get('/form',(req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'views','form.html'))
});

app.post('/form',(req,res,next)=>{
    const data=req.body.name;
    console.log('data==',data);
    
    Item.create({
        name:data
    }).then(resp=>{
        res.status(201).json({message:'success',data:data})
    })
    .catch(err=>{
        console.log(err)
    })
})


app.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    
    try {
        const totalItems = await Item.countDocuments();
        const items = await Item.find()
        .skip((page - 1) * perPage)
        .limit(perPage);
        
        res.render('index', {
            items,
            currentPage: page,
            totalPages: Math.ceil(totalItems / perPage),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

mongoose.connect('mongodb://0.0.0.0:27017/practice-06', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})

