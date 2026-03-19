import {getTranslations} from 'next-intl/server';
import {Metadata} from 'next';
import {defaultMetadata} from "@/constants";

export async function getPageMetadata(locale: string, namespace: string): Promise<Metadata> {
  const t = await getTranslations({locale, namespace});

  return {
    ...defaultMetadata,
    title: `${t('title')} | Vegan Moldova`,
    description: t('description'),
  };
}
