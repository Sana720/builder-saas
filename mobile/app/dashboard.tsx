import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { supabase } from '../src/lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/login")
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Welcome Resident 👋</Text>
      <Text>Email: {user?.email}</Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 30,
          padding: 12,
          backgroundColor: "red",
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
