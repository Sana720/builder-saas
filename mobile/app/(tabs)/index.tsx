import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { supabase } from '../../src/lib/supabaseClient'

export default function Index() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from('tenants').select('*')
      if (error) {
        console.log('❌ Supabase Error:', error)
      } else {
        console.log('✅ Supabase connected:', data)
      }
    }
    testConnection()
  }, [])

  return (
    <View>
      <Text>🏗️ Builder SaaS Resident App</Text>
    </View>
  )
}
