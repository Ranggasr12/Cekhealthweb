
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) {
      return Response.json({
        success: false,
        error: error.message
      }, { status: 400 })
    }

    return Response.json({
      success: true,
      user: data.user,
      session: data.session
    })

  } catch (error) {
    return Response.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}