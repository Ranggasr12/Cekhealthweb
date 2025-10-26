import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Box, Input, Button, Heading, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toast({ title: error.message, status: "error" });

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    
    if (profile.role === "admin") router.push("/admin");
    else router.push("/user");
  };

  return (
    <Box maxW="md" mx="auto" mt="100px">
      <Heading mb={4}>Login</Heading>
      <Input placeholder="Email" mb={3} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" mb={3} onChange={(e) => setPassword(e.target.value)} />
      <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
    </Box>
  );
}
