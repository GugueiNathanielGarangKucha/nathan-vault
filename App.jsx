import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// This connects your app to Supabase using the keys in your .env file
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function App() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')

  // Pulls data from the "vault_items" table you created
  async function fetchVault() {
    const { data, error } = await supabase.from('vault_items').select('*')
    if (error) console.log("Error fetching:", error)
    else setItems(data)
  }

  // Runs once when the page loads
  useEffect(() => {
    fetchVault()
  }, [])

  // Sends your input text to the database
  async function addItem() {
    if (!newItem) return
    const { error } = await supabase.from('vault_items').insert([{ content: newItem }])
    if (error) console.log("Error inserting:", error)
    
    setNewItem('') // Clears the input box
    fetchVault()   // Refreshes the list so you see the new item
  }

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>My Digital Vault</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          value={newItem} 
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Type a note..."
          style={{ padding: '8px', flex: 1 }}
        />
        <button onClick={addItem} style={{ cursor: 'pointer' }}>Save</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {/* --- THIS IS THE ITEMS.MAP PART --- */}
        {items.map((item) => (
          <li key={item.id} style={{ 
            padding: '10px', 
            borderBottom: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between' 
          }}>
            {item.content}
          </li>
        ))}
        {/* ---------------------------------- */}
      </ul>
    </div>
  )
}

export default App