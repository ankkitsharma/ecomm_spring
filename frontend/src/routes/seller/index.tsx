import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchMyProducts, deleteProduct, fetchCategories } from '../../lib/api'
import { Plus, Pencil, Trash2, Package, Tag, DollarSign, Layers } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createProduct, updateProduct } from '../../lib/api'

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  stockQuantity: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  imageUrl: z.string().url('Must be a valid URL'),
  categoryId: z.coerce.number().positive('Category is required'),
})

type ProductFormData = z.infer<typeof productSchema>

export const Route = createFileRoute('/seller/')({
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

  if (isLoading) return <div className="animate-pulse py-12 text-center text-gray-400">Loading your inventory...</div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-gray-500">Manage your products and track stock levels</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            reset()
            setIsModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.map((product: any) => (
          <div key={product.id} className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    <Tag className="h-3 w-3" />
                    {product.categoryName}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => handleEdit(product)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(product.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-400">Price</span>
                  <span className="text-lg font-black text-gray-900">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium text-gray-400">Stock</span>
                  <span className={`text-sm font-bold ${product.stockQuantity < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                    {product.stockQuantity} units
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="border-b bg-gray-50/50 px-8 py-6">
              <h2 className="text-2xl font-black text-gray-900">{editingId ? 'Edit Product' : 'List New Product'}</h2>
              <p className="text-sm text-gray-500">Provide details about your product for potential buyers</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Name</label>
                  <input {...register('name')} className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="e.g. Premium Wireless Headphones" />
                  {errors.name && <p className="text-xs font-semibold text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Category</label>
                  <select {...register('categoryId')} className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10">
                    <option value="">Select a category</option>
                    {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.categoryId && <p className="text-xs font-semibold text-red-500">{errors.categoryId.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Price ($)</label>
                  <input type="number" step="0.01" {...register('price')} className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="99.99" />
                  {errors.price && <p className="text-xs font-semibold text-red-500">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Stock Quantity</label>
                  <input type="number" {...register('stockQuantity')} className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="50" />
                  {errors.stockQuantity && <p className="text-xs font-semibold text-red-500">{errors.stockQuantity.message}</p>}
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Image URL</label>
                  <input {...register('imageUrl')} className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="https://images.unsplash.com/..." />
                  {errors.imageUrl && <p className="text-xs font-semibold text-red-500">{errors.imageUrl.message}</p>}
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</label>
                  <textarea rows={4} {...register('description')} className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="Describe the key features and benefits..." />
                  {errors.description && <p className="text-xs font-semibold text-red-500">{errors.description.message}</p>}
                </div>
              </div>
              <div className="mt-8 flex gap-3 border-t pt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" disabled={saveMutation.isPending} className="flex-[2] rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-[0.98]">
                  {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
