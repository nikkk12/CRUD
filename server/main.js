const express = require('express')
const app = express()
const fs = require('fs/promises')
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.get('/api/products' , async (req,res) => {
    const data = await fs.readFile('data.json' , 'utf-8')
    const parsedData = JSON.parse(data)
    return res.json(parsedData)
})

app.get('/api/products/:id' , async (req,res) => {
    const {id} = req.params
    const data = await fs.readFile('data.json' , 'utf-8')
    const parsedData = JSON.parse(data)
    const productId = parsedData.find(product => product.id === Number(id)) 
    if(!productId) res.json({success: false , data: null})
    return res.json(productId) 
}) 
 
app.post('/api/create' , async (req,res) => {
    const {name , price , isExpired , category} = req.body
    if(!name || !price) return res.status(400).json({success: false , data: null , message: "Name and Price is required"})
    const data = await fs.readFile('data.json' , 'utf-8')
    const parsedData = JSON.parse(data)     
    const lastId = parsedData[parsedData.length -1]?.id || 0 
    const newProduct = { 
        id: lastId + 1, 
        category,
        name, 
        price, 
        isExpired 
    } 
    parsedData.push(newProduct)
    await fs.writeFile('data.json' , JSON.stringify(parsedData))
    return res.status(201).json({success: true , message: "Product created successfully"})
})
 
app.delete('/api/delete/:id' , async(req,res) => {
    const {id} = req.params
    const data = await fs.readFile('data.json' , 'utf-8')
    const parsedData = JSON.parse(data)
    const index = parsedData.findIndex(el => el.id === Number(id))
    if(index === -1) return res.json({success: false , message: "Can`t delete this item"})
    const deletedProduct = parsedData.splice(index,1) 
    await fs.writeFile('data.json' , JSON.stringify(parsedData))  
    return res.json(deletedProduct)
}) 

app.put('/api/update/:id' , async (req,res) => {
    const {id} = req.params
    const {name,price,isExpired,category} = req.body
    const data = await fs.readFile('data.json' , 'utf-8')
    const parsedData = JSON.parse(data)
    const index = parsedData.findIndex(el => el.id === Number(id))
    if(index === -1) return res.json({success: false , message: "Can`t delete this item"})
    parsedData[index] = {
        ...parsedData[index],
        category: category ? category : parsedData[index].category,
        name : name ? name : parsedData[index].name,
        price : price ? price : parsedData[index].price,
        isExpired: (typeof isExpired !== 'undefined') ? isExpired : parsedData[index].isExpired
    }    
    await fs.writeFile('data.json' , JSON.stringify(parsedData))
    return res.json(parsedData[index])
})

app.listen(3001, () => {
    console.log("server running on http://localhost:3000")
})