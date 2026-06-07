import { supabase } from './supabaseClient'

export async function createOrder({
  tableNumber,
  totalPrice,
  items,
}){
console.log("ORDER PAYLOAD:", {
  table_number: tableNumber,
  total_price: totalPrice,
  status: "placed",
}) 

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
      console.log("ORDER INSERT ERROR:", orderError)
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