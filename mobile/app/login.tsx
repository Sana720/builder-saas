import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../src/lib/supabaseClient";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Login with Supabase Auth
      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      const userId = authData?.user?.id;
      if (!userId) throw new Error("User not found after login.");

      // 2️⃣ Fetch the user's role from the 'users' table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .maybeSingle(); // ✅ Fix: use maybeSingle to prevent coercion error

      if (userError) throw userError;

      if (!userData) {
        throw new Error("No user record found in database.");
      }

      const role = userData.role;

      // 3️⃣ Allow only residents
      if (role !== "resident") {
        await supabase.auth.signOut();
        Alert.alert(
          "Access Denied",
          "This mobile app is only for residents. Please use the ERP dashboard instead."
        );
        return;
      }

      // 4️⃣ Success
      Alert.alert("Success", "Welcome back!");
      router.replace("/dashboard");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Resident Login
      </Text>

      <Text style={{ marginBottom: 6, fontWeight: "600" }}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      <Text style={{ marginBottom: 6, fontWeight: "600" }}>Password</Text>
      <TextInput
        placeholder="Enter your password"
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
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: "#007bff",
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            Login
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text
          style={{
            textAlign: "center",
            color: "#007bff",
            marginTop: 16,
          }}
        >
          Don’t have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}
