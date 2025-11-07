'use client'

import CreateProduct from "@/components/CreateProduct";
import axios from "axios";
import { useEffect , useState } from 'react'

export default function Home() {

  type Product = {
    id: number,
    category: string,
    name: string,
    price: number,
    isExpired: boolean
  }

 const BASE_URL = 'http://localhost:3001'
 const [products , setProducts] = useState<Product[]>([])
 const [show,setShow] = useState(false)
 const [isUpdate, setIsUpdate] = useState(false)
 const [id, setId] = useState(0)

 const getData = async () => {
  const res = await axios.get(`${BASE_URL}/api/products`)
  setProducts(res.data)
 }

 const deleteProduct = async (id : number) => {
  const res = await axios.delete(`${BASE_URL}/api/delete/${id}`)
  if(res.status === 200) {
    getData()
  }
 }

 const updateProduct = async (id : number) => {
  setShow(true)
  setIsUpdate(true)
  setId(id)
 }

  useEffect(() => {
    getData()
  } , [])

  const closeModal  = () => {
    setShow(!show)
  }

  return (
   <>
   <div className="flex flex-col ">
    <button onClick={() => {setShow(!show); setIsUpdate(false)}} className="bg-blue-500 p-2 w-[200px]">Create Product</button>
      <div className="w-3/4">
       {products.map((el) => (
       <div key={el.id} className={`w-full gap-4 justify-around flex m-auto my-3 p-4 ${el.isExpired ? "bg-red-500" : "bg-green-800"} `}>
        <h2 className="text-white text-xl">Category: {el.category}</h2>
        <h2 className="text-white text-xl ">Name: {el.name}</h2>
        <h2 className="text-white text-xl">Price: {el.price}</h2>
       <div>
       <button onClick={() => deleteProduct(el.id)} className="bg-blue-500 p-2 w-[200px] border-black mx-1">Delete</button>
       <button onClick={() => updateProduct(el.id)} className="bg-blue-500 p-2 w-[200px] border-black mx-1">Update</button>
       </div>
       </div>
       ))}
      </div>
   {show ? <CreateProduct closeModal={closeModal} getData={getData} isUpdate={isUpdate} id={id} /> : null}
   </div>
   </>
  );
}
