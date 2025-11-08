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
 const [hide,setHide] = useState(true)

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

  function hideBox () {
    setHide(true)
  }

  return (
   <>
   <div className="flex w-full  flex-col bg-[#121212] h-screen">
    <button onClick={() => {setShow(!show); setIsUpdate(false) ; setHide(!hide)}} className={hide ? `bg-blue-500 text-white p-2 w-[200px]` : "w-0  transition-all duration-900 ease-in-out"}>{hide ? "Create Product" : ""}</button>
      <div className="w-full">
       {products.map((el) => (
       <div key={el.id} className={`w-full  items-center justify-around flex m-auto my-3  ${el.isExpired ? "bg-[#e74c3c]" : "bg-[#1abc9c]"} `}>
        <h2 className="text-white text-xl w-[290px]">Category: {el.category}</h2>
        <h2 className="text-white text-xl w-[290px] ">Name: {el.name}</h2>
        <h2 className="text-white text-xl w-[290px]">Price: $ {el.price}</h2>
       <div className="flex "> 
       <button onClick={() => deleteProduct(el.id)} className="bg-[#c0392b] h-[20px] cursor-pointer mr-1 rounded-2xl text-white  w-[200px] border-black ">Delete</button>
       <button onClick={() => updateProduct(el.id)} className="bg-[#2980b9] h-[20px] cursor-pointer rounded-2xl  w-[200px] border-black ">Update</button>
       </div>
       </div>
       ))}
      </div>
   {show ? <CreateProduct  setHide={hideBox} closeModal={closeModal} getData={getData} isUpdate={isUpdate} id={id} /> : null}
   </div>
   </>
  );
}
