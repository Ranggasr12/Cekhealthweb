import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Hook untuk CRUD operations
export const useSupabase = (tableName) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all data
  const fetchData = async (options = {}) => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from(tableName).select('*')

      // Apply ordering if specified
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending !== false })
      }

      // Apply filters if specified
      if (options.filters) {
        options.filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value)
        })
      }

      const { data, error } = await query

      if (error) throw error
      setData(data || [])
      return data
    } catch (err) {
      setError(err.message)
      console.error(`Error fetching ${tableName}:`, err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Insert data
  const insertData = async (newData) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert([newData])
        .select()

      if (error) throw error
      
      // Update local state
      setData(prev => [...prev, ...data])
      return data
    } catch (err) {
      setError(err.message)
      console.error(`Error inserting into ${tableName}:`, err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Update data
  const updateData = async (id, updates) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      
      // Update local state
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ))
      return data
    } catch (err) {
      setError(err.message)
      console.error(`Error updating ${tableName}:`, err)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Delete data
  const deleteData = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setData(prev => prev.filter(item => item.id !== id))
      return true
    } catch (err) {
      setError(err.message)
      console.error(`Error deleting from ${tableName}:`, err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Subscribe to realtime changes
  const subscribeToChanges = (callback) => {
    const subscription = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  return {
    data,
    loading,
    error,
    fetchData,
    insertData,
    updateData,
    deleteData,
    subscribeToChanges
  }
}

// Hook khusus untuk authentication
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    resetPassword
  }
}

// Hook untuk file uploads
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const uploadFile = async (file, bucketName, filePath) => {
    setUploading(true)
    setUploadError(null)
    
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      return { publicUrl, error: null }
    } catch (error) {
      setUploadError(error.message)
      return { publicUrl: null, error }
    } finally {
      setUploading(false)
    }
  }

  const deleteFile = async (bucketName, filePath) => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath])

      return { error }
    } catch (error) {
      return { error }
    }
  }

  return {
    uploading,
    uploadError,
    uploadFile,
    deleteFile
  }
}