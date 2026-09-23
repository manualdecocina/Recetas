import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase/public'

interface Props { params: { rest: string[] } }

export default async function LegacyRouteRedirect({ params }: Props) {
  const sourcePath = '/' + params.rest.join('/')
  const { data } = await supabase.from('content_redirects').select('target_path,status_code').eq('source_path', sourcePath).maybeSingle()
  if (data?.target_path) redirect(data.target_path)
  return null
}