import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../src/lib/supabaseClient";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      if (!user) {
        Alert.alert("Error", "Unable to create user.");
        return;
      }

      // 2️⃣ Add user profile in users table
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          email,
          name,
          phone,
          role: "resident", // automatically resident
        },
      ]);

      if (insertError) throw insertError;

      Alert.alert(
        "Success 🎉",
        "Account created successfully. You can now log in.",
        [
          { text: "Go to Login", onPress: () => router.replace("/login") }
        ]
      );
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 30 }}>
        Resident Registration
      </Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      <TextInput
        placeholder="Phone (optional)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 24,
        }}
      />

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        style={{
          backgroundColor: "#28a745",
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={{ textAlign: "center", color: "#007bff", fontSize: 14 }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
