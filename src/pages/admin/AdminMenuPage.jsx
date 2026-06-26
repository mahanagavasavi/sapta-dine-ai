import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  getMenuItems,
  updateMenuItem,
  createMenuItem,
} from '../../services/menuService.js'

function formatPriceINR(value) {
  const amount = Number(value || 0)
  return `₹${amount}`
}

function IconEdit() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconEye({ slashed }) {
  if (slashed) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconX() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100'

export default function AdminMenuPage() {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
  })

  useEffect(() => {
    async function loadMenu() {
      const data = await getMenuItems()
      setItems(data)
    }
    loadMenu()
  }, [])

  const visible = useMemo(() => {
    const q = String(query || '').toLowerCase().trim()
    if (!q) return items
    return items.filter((i) => {
      const text = `${i.name} ${i.description} ${i.categoryId} ${(i.tags || []).join(' ')}`.toLowerCase()
      return text.includes(q)
    })
  }, [items, query])

  async function toggleAvailable(itemId) {
    const item = items.find((i) => i.id === itemId)
    if (!item) return
    const updated = await updateMenuItem(itemId, { available: !item.available })
    setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)))
  }

  async function handleAddItem() {
    if (!newItem.name || !newItem.description || !newItem.category || !newItem.price) return
    const created = await createMenuItem({
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      price: Number(newItem.price),
      available: true,
    })
    setItems((prev) => [...prev, created])
    setNewItem({ name: '', description: '', category: '', price: '' })
    setShowModal(false)
  }

  async function handleUpdateItem() {
    if (!editingId) return
    const updated = await updateMenuItem(editingId, {
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      price: Number(newItem.price),
    })
    setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)))
    setEditingId(null)
    setNewItem({ name: '', description: '', category: '', price: '' })
    setShowModal(false)
  }

  function openAddModal() {
    setEditingId(null)
    setNewItem({ name: '', description: '', category: '', price: '' })
    setShowModal(true)
  }

  function openEditModal(item) {
    setEditingId(item.id)
    setNewItem({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setNewItem({ name: '', description: '', category: '', price: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
              SAPTA DINE AI
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Menu Management</span>
              <span className="mx-2 text-gray-300">·</span>
              Manage your restaurant menu items
            </p>
          </div>
          <nav className="flex shrink-0 items-center gap-2">
            <Link
              to="/admin"
              className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow"
            >
              Orders
            </Link>
            <Link
              to="/"
              className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
            >
              Customer View
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Action Bar ─────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-400">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search items, tags, category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-95"
          >
            <IconPlus />
            Add New Item
          </button>
        </div>

        {/* ── Count label ────────────────────────────────── */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
          {visible.length} item{visible.length !== 1 ? 's' : ''}
        </p>

        {/* ── Table — desktop / tablet ────────────────────── */}
        {visible.length > 0 ? (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Food
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Category
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Price
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {visible.map((item) => (
                      <tr key={item.id} className="group transition-colors hover:bg-gray-50">

                        {/* Food */}
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="mt-0.5 max-w-xs truncate text-xs text-gray-400">
                            {item.description}
                          </p>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100">
                            {item.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            {formatPriceINR(item.price)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {item.available ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-100">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                              Unavailable
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              title="Edit item"
                              onClick={() => openEditModal(item)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                              <IconEdit />
                            </button>
                            <button
                              title={item.available ? 'Mark unavailable' : 'Mark available'}
                              onClick={() => toggleAvailable(item.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            >
                              <IconEye slashed={item.available} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Cards — mobile ──────────────────────────── */}
            <div className="space-y-3 md:hidden">
              {visible.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="mt-0.5 text-sm leading-snug text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      {item.available ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-100">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-100">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          Unavailable
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2.5">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100">
                        {item.category}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatPriceINR(item.price)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-stretch divide-x divide-gray-100 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                      <IconEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleAvailable(item.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-medium text-gray-500 transition hover:bg-gray-50"
                    >
                      <IconEye slashed={item.available} />
                      {item.available ? 'Unavailable' : 'Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <span className="text-5xl">🍽️</span>
            <p className="mt-4 text-base font-semibold text-gray-900">No items found</p>
            <p className="mt-1 text-sm text-gray-400">
              {query ? 'Try a different search term.' : 'Add your first menu item to get started.'}
            </p>
            {!query && (
              <button
                onClick={openAddModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
              >
                <IconPlus />
                Add New Item
              </button>
            )}
          </div>
        )}
      </main>

      {/* ── Modal ──────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Panel */}
          <div className="relative z-10 w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingId ? 'Edit Menu Item' : 'Add New Item'}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {editingId
                    ? 'Update the details below and save.'
                    : 'Fill in the details to add a new dish.'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <IconX />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Name">
                  <input
                    type="text"
                    placeholder="e.g. Paneer Biryani"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className={inputCls}
                  />
                </FormField>
                <FormField label="Category">
                  <input
                    type="text"
                    placeholder="e.g. Starters, Mains"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className={inputCls}
                  />
                </FormField>
                <div className="sm:col-span-2">
                  <FormField label="Description">
                    <input
                      type="text"
                      placeholder="Short description of the dish"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className={inputCls}
                    />
                  </FormField>
                </div>
                <FormField label="Price (₹)">
                  <input
                    type="number"
                    placeholder="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className={inputCls}
                  />
                </FormField>
              </div>

              {/* Modal footer */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingId ? handleUpdateItem : handleAddItem}
                  className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-95"
                >
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
