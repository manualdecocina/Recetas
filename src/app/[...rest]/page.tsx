import { legacyMetadata, LegacyPublicPage } from '@/lib/legacy-route'

interface Props { params: Promise<{ rest: string[] }> }

function sourcePath(rest: string[]): string {
  return '/' + rest.join('/')
}

export async function generateMetadata({ params }: Props) {
  const { rest } = await params
  return legacyMetadata(sourcePath(rest))
}

export default async function LegacyPublicRoute({ params }: Props) {
  const { rest } = await params
  return <LegacyPublicPage path={sourcePath(rest)} />
}
