import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchMyProducts, deleteProduct, fetchCategories, createProduct, updateProduct } from '@ecomm/api'
import { Plus, Pencil, Trash2, Tag, Layers, DollarSign, Package, X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  stockQuantity: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  imageUrl: z.string().url('Must be a valid URL'),
  categoryId: z.coerce.number().positive('Category is required'),
})

type ProductFormData = z.infer<typeof productSchema>

export const Route = createFileRoute('/')({
  component: SellerDashboard,
})

function SellerDashboard() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: products, isLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: fetchMyProducts,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seller-products'] }),
  })

  const saveMutation = useMutation({
    mutationFn: (data: ProductFormData) => 
      editingId ? updateProduct(editingId, data) : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] })
      setIsModalOpen(false)
      reset()
      setEditingId(null)
    },
  })

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setValue('name', product.name)
    setValue('description', product.description)
    setValue('price', product.price)
    setValue('stockQuantity', product.stockQuantity)
    setValue('imageUrl', product.imageUrl)
    setValue('categoryId', product.categoryId)
    setIsModalOpen(true)
  }

  const onSubmit = (data: ProductFormData) => saveMutation.mutate(data)

  if (isLoading) return <div className="animate-pulse py-20 text-center font-black text-gray-400">SYNCING INVENTORY...</div>

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Your Inventory</h1>
          <p className="mt-2 text-gray-500 font-medium">Strategic asset management and stock control</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            reset()
            setIsModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-[2rem] bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          List New Asset
        </button>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.map((product: any) => (
          <div key={product.id} className="group relative overflow-hidden rounded-[2.5rem] border bg-white shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900 text-lg truncate">{product.name}</h3>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    <Tag className="h-3 w-3" />
                    {product.categoryName}
                  </span>
                </div>
                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 ml-4">
                  <button onClick={() => handleEdit(product)} className="rounded-xl p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(product.id)} className="rounded-xl p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between border-t pt-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">MSRP</p>
                  <p className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reserve</p>
                  <p className={`text-sm font-black ${product.stockQuantity < 5 ? 'text-red-500' : 'text-gray-900'}`}>
                    {product.stockQuantity} units
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/80 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl overflow-hidden rounded-[3rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b bg-gray-50/50 px-10 py-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase">{editingId ? 'Edit Asset' : 'New Listing'}</h2>
                <p className="text-sm font-medium text-gray-500">Provide comprehensive details for the marketplace</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 hover:bg-gray-200 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-10">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Asset Nomenclature</label>
                  <input {...register('name')} className="input-premium" placeholder="e.g. Quantum Processor X1" />
                  {errors.name && <p className="text-xs font-bold text-red-500 ml-4">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Classification</label>
                  <select {...register('categoryId')} className="input-premium appearance-none">
                    <option value="">Select Category</option>
                    {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.categoryId && <p className="text-xs font-bold text-red-500 ml-4">{errors.categoryId.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Unit Valuation ($)</label>
                  <input type="number" step="0.01" {...register('price')} className="input-premium" placeholder="99.99" />
                  {errors.price && <p className="text-xs font-bold text-red-500 ml-4">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Inventory Reserve</label>
                  <input type="number" {...register('stockQuantity')} className="input-premium" placeholder="50" />
                  {errors.stockQuantity && <p className="text-xs font-bold text-red-500 ml-4">{errors.stockQuantity.message}</p>}
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Visual Asset URL</label>
                  <input {...register('imageUrl')} className="input-premium" placeholder="https://images.unsplash.com/..." />
                  {errors.imageUrl && <p className="text-xs font-bold text-red-500 ml-4">{errors.imageUrl.message}</p>}
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Strategic Description</label>
                  <textarea rows={4} {...register('description')} className="input-premium py-4" placeholder="Detail the unique value proposition..." />
                  {errors.description && <p className="text-xs font-bold text-red-500 ml-4">{errors.description.message}</p>}
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-[2rem] bg-gray-100 py-5 text-sm font-black text-gray-600 transition-colors hover:bg-gray-200">
                  DISCARD
                </button>
                <button type="submit" disabled={saveMutation.isPending} className="flex-[2] rounded-[2rem] bg-blue-600 py-5 text-sm font-black text-white shadow-2xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50">
                  {saveMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (editingId ? 'UPDATE ASSET' : 'LIST ASSET')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
