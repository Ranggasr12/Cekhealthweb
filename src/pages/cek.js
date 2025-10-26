import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { jsPDF } from "jspdf";
import useUser from "@/lib/useUser";
import Navbar from "@/components/navbar";

export default function CekPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", score: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return alert("Login dulu");
    setLoading(true);

    const doc = new jsPDF();
    doc.text("Hasil Cek Kesehatan", 10, 20);
    const pdfBlob = doc.output("blob");

    const fileName = `results/${user.id}_${Date.now()}.pdf`;
    await supabase.storage.from("results").upload(fileName, pdfBlob);
    const { data } = supabase.storage.from("results").getPublicUrl(fileName);

    await supabase.from("health_results").insert({
      user_id: user.id,
      name: form.name,
      age: form.age,
      score: form.score,
      pdf_url: data.publicUrl
    });

    alert("Tersimpan!");
    window.open(data.publicUrl, "_blank");
    setLoading(false);
  }

  return (... Sama HTML form kamu ...)
}
