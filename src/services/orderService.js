import { supabase } from './supabaseClient'

export async function createOrder({
  tableNumber,
  totalPrice,
  items,
}){


  const { data: order, error: orderError } = await supabase
    .from('orders')
   
    .insert([
      {
        table_number: tableNumber,
        total_price: totalPrice,
        status: 'placed',
      },
    ])
    .select()
    .single()

    if (orderError) {
  
      throw orderError
    }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    menu_item_id: Number(item.itemId),
    quantity: item.qty,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    throw itemsError
  }

  return order
}
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function updateOrderStatus(orderId, status) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    throw error
  }
}