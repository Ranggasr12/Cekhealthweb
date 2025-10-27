// src/pages/admin/manage-admin.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, Spinner, useToast, Flex, Avatar, Text, Stack, IconButton
} from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";

export default function ManageAdmin() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [checkingRole, setCheckingRole] = useState(true);

  // check current user session & role
  useEffect(() => {
    let mounted = true;

    async function check() {
      const { data: { session }, error: sessErr } = await supabase.auth.getSession();
      if (sessErr) {
        toast({ title: "Auth error", description: sessErr.message, status: "error" });
        router.push("/login");
        return;
      }
      if (!session?.user) {
        router.push("/login");
        return;
      }

      // fetch profile for current user
      const { data: me, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("fetch profile error", error);
        toast({ title: "Error", description: "Gagal mengambil profil", status: "error" });
        router.push("/");
        return;
      }

      if (me?.role !== "admin") {
        toast({ title: "Access denied", description: "Anda bukan admin", status: "error" });
        router.push("/");
        return;
      }

      if (mounted) setCheckingRole(false);
    }

    check();
    return () => { mounted = false; };
  }, [router, toast]);

  // load profiles + realtime subscription
  useEffect(() => {
    let sub;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        toast({ title: "Error", description: "Gagal memuat users", status: "error" });
        setLoading(false);
        return;
      }
      setProfiles(data || []);
      setLoading(false);

      // subscribe realtime changes on profiles table
      sub = supabase.channel("public:profiles")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profiles" },
          (payload) => {
            // simple refresh: fetch again or apply payload
            // for simplicity fetch again:
            (async () => {
              const { data: d } = await supabase.from("profiles").select("id, email, role, created_at").order("created_at", { ascending: false });
              if (d) setProfiles(d);
            })();
          }
        )
        .subscribe();
    }

    load();

    return () => {
      if (sub) supabase.removeChannel(sub);
    };
  }, [toast]);

  async function updateRole(id, newRole) {
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", id);
      if (error) throw error;
      toast({ title: "Sukses", description: `Role diubah menjadi ${newRole}`, status: "success" });
      // update local state
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, role: newRole } : p));
    } catch (err) {
      console.error(err);
      toast({ title: "Gagal", description: err.message || "Terjadi kesalahan", status: "error" });
    }
  }

  if (checkingRole) {
    return (
      <Flex align="center" justify="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6}>
      <Stack direction="row" justify="space-between" align="center" mb={6}>
        <Heading size="md">Manajemen Admin</Heading>
        <Text color="gray.600">Kelola hak akses user (admin/user)</Text>
      </Stack>

      {loading ? (
        <Flex align="center" justify="center" py={12}><Spinner size="lg" /></Flex>
      ) : (
        <Box borderWidth="1px" borderRadius="md" overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Info</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Created At</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {profiles.map((p) => (
                <Tr key={p.id}>
                  <Td>
                    <Flex align="center">
                      <Avatar name={p.email} size="sm" mr={3} />
                      <Box>
                        <Text fontWeight="semibold">{p.email.split("@")[0]}</Text>
                        <Text fontSize="sm" color="gray.500">{p.id}</Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td>{p.email}</Td>
                  <Td>{p.role}</Td>
                  <Td>{p.created_at ? new Date(p.created_at).toLocaleString() : "-"}</Td>
                  <Td>
                    {p.role === "admin" ? (
                      <Button size="sm" colorScheme="red" onClick={() => updateRole(p.id, "user")}>
                        Revoke Admin
                      </Button>
                    ) : (
                      <Button size="sm" colorScheme="green" onClick={() => updateRole(p.id, "admin")}>
                        Make Admin
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
