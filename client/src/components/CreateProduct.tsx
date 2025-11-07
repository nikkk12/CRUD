'use client'
import axios from "axios"
import { useState , useEffect } from "react"

type PropType = {
    closeModal : () => void,
    getData: () => void,
    isUpdate: boolean,
    id: number
}

export default function CreateProduct({closeModal , getData , isUpdate , id} : PropType) {

  const [category,setCategory] = useState('')
  const [name,setName] = useState('')
  const [price,setPrice] = useState<any>('')
  const [expired, setExpired] = useState(false)

  const handleSubmit = async (e :React.FormEvent<HTMLFormElement>) => {
   e.preventDefault()
   if(isUpdate){
    const res = await axios.put(`http://localhost:3001/api/update/${id}` , {
        category,
        name,
        price,
        isExpired: expired
       })
       console.log(res , "res")
       if(res.status === 200){
        closeModal()
        getData()
       }
   }else{
    const res = await axios.post(`http://localhost:3001/api/create` , {
        category,
        name,
        price,
        isExpired: expired
       })
       console.log(res , "res")
       if(res.status === 201){
        closeModal()
        getData()
       }
   }
  }

  const getProductById = async (id : number) => {
    const res = await axios.get(`http://localhost:3001/api/products/${id}`)
    setCategory(res.data.category)
    setName(res.data.name)
    setPrice(res.data.price)
    setExpired(res.data.isExpired)
  }

  useEffect(() => {
    if(isUpdate){
        getProductById(id)
    }
  } , [])

  return (
    <div className=" absolute border-2 border-black w-3/4 bg-gray-50 top-[10%] p-2 h-2/3">
        <form onSubmit={handleSubmit}>
            <input type="text"
             placeholder="category"
             className="h-10 my-2 w-full border-2 border-black rounded-md"
             onChange={(e) => {setCategory(e.target.value)}}
             value={category}
            />
            <input type="text"
             placeholder="Enter Name"
             className="h-10 my-2 w-full border-2 border-black rounded-md"
             onChange={(e) => {setName(e.target.value)}}
             value={name}
             />
            <input type="number"
            value={price}
            placeholder="Enter Price"
            className="h-10 my-2 w-full border-2 border-black rounded-md"
            onChange={(e) => {setPrice(e.target.value)}}
            />
            <div className="flex gap-5">
            <label htmlFor="expired">Is Expired</label>
            <input id="expired" type="checkbox"
            checked={expired}
            onChange={(e) => {setExpired(prev => !prev)}}
            />
            </div>
            <button className="bg-blue-500 p-2 w-[200px]">{isUpdate ? "Update Product" : "Create "}</button>
        </form>
    </div>
  )
}
