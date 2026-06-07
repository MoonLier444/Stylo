import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY')!

const OW_TO_STYLO_CONDITION: Record<string, string> = {
  Clear: 'clear',
  Clouds: 'cloudy',
  Rain: 'rain',
  Drizzle: 'rain',
  Thunderstorm: 'storm',
  Snow: 'snow',
  Mist: 'fog',
  Fog: 'fog',
  Haze: 'fog',
  Dust: 'fog',
  Wind: 'wind',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { user_id, latitude, longitude } = await req.json()

  const owUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
  const owRes = await fetch(owUrl)
  const owData = await owRes.json()

  if (!owRes.ok) {
    return new Response(JSON.stringify({ error: 'Weather fetch failed' }), { status: 502 })
  }

  const condition = OW_TO_STYLO_CONDITION[owData.weather?.[0]?.main] ?? 'clear'
  const weather = {
    temperature: owData.main.temp,
    feels_like: owData.main.feels_like,
    humidity: owData.main.humidity,
    wind_speed: owData.wind.speed,
    condition,
  }

  const validUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString()

  await supabase.from('weather_cache').insert({
    user_id,
    latitude,
    longitude,
    ...weather,
    valid_until: validUntil,
  })

  return new Response(JSON.stringify({ weather }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
