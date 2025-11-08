'use client'
import axios from "axios"
import { useState , useEffect, useRef } from "react"

type PropType = {
  closeModal : () => void,
  getData: () => void,
  isUpdate: boolean,
  id: number
  setHide: () => void
}

export default function CreateProduct({closeModal , getData , isUpdate , id , setHide} : PropType) {

  const [category,setCategory] = useState('')
  const [name,setName] = useState('')
  const [price,setPrice] = useState<any>('')
  const [expired, setExpired] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)

  const createProduct = () => {
    if(category !== "" && name !== "" || price !== ""){
      setHide()
      closeModal()
    }
  }

  const handleSubmit = async (e :React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(isUpdate){
      const res = await axios.put(`http://localhost:3001/api/update/${id}` , {
        category,
        name,
        price,
        isExpired: expired
      })
      if(res.status === 200){
        closeModal()
        getData()
      }
    } else {
      const res = await axios.post(`http://localhost:3001/api/create` , {
        category,
        name,
        price,
        isExpired: expired
      })
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

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapper.current && !wrapper.current.contains(e.target as Node)) {
        closeModal()
        setHide()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={wrapper} className="absolute border-2 border-black w-1/4 rounded-2xl bg-gray-400 top-[15%] p-2 h-2/3">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category"
          className="h-10 my-2 w-full border-b border-black placeholder-gray-200"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        />
        <input
          type="text"
          placeholder="Product name"
          className="h-10 my-2 w-full border-b border-black placeholder-gray-200"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="number"
          value={price}
          placeholder="Product price"
          className="h-10 my-2 w-full border-b border-black placeholder-gray-200"
          onChange={(e) => setPrice(e.target.value)}
        />
        <div className="flex gap-5 items-center">
          <label htmlFor="expired" className="cursor-pointer text-gray-800">Is Expired</label>
          <input
            id="expired"
            type="checkbox"
            checked={expired}
            onChange={() => setExpired(prev => !prev)}
          />
        </div>
        <button
          onClick={createProduct}
          className="bg-gray-500 p-2 w-[200px] mt-4 cursor-pointer text-white rounded-2xl"
        >
          {isUpdate ? "Update Product" : "Create"}
        </button>
      </form>
    </div>
  )
}
