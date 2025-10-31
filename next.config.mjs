const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['https://gcnblwhhxtvvetpzgleq.supabase.co'],
  },
  // Optional: Untuk performance
  compiler: {
    styledComponents: true,
  },
}

export default nextConfig