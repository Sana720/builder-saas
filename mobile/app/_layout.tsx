import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "../src/lib/supabaseClient";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        router.replace("/login");  // not logged in → login screen
      } else {
        router.replace("/dashboard"); // logged in → dashboard
      }
    };

    checkAuth();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
